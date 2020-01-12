// room_name : List of rooms
// id : {"Name1" : "ID1", "Name2" : "ID2"} Type 
const room_name = [];
const blank = "\u200b".repeat(500);
const id = { };

function getweb(URL) { return Utils.getWebText(URL).replace(/<[^>]+>/g, "").replace(/(<([^>]+)>)/g, "").replace(/[\n\s]{2,}/g, "\n").trim(); }

function checkProblem(number) {
  try {
    var $ = getweb("https://www.acmicpc.net/problem/" + number);
    return true;
  }
  catch (e) {
    return false;
  }
}

// Contribution by DongGeun Yun (ydk1104)
function getBojProblem(n) {
  try {
    var $ = getweb("https://www.acmicpc.net/problem/" + n).split("강의 요청하기")[1].split("문제");
    var out = ""; for (var i = 1; i < $.length; i++) out += $[i] + "문제";
    $ = out.split("힌트");
    out = "// " + n + "번 \n";
    for (var i = 0; i < $.length - 1; i++) out += $[i];
    return out.replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, "<");
  } catch (e) {
    return ("# Cannot find result");
  }
}

// Contribution by DongGeun Yun (ydk1104)
function daySolve(id) {
  try {
    var $ = getweb("https://www.acmicpc.net/status?user_id=" + id + "&result_id=4");
    return 20 - $.split("일 전").length + 1 - $.split("달 전").length + 1;
  } catch (e) {
    return ("# Parsing Error");
  }
}

//check id sovlve boj.kr/number
function checkSolve(id, number) {
  try {
    var $ = getweb("https://www.acmicpc.net/status?problem_id=" + number + "&user_id=" + id + "&result_id=4");
    return $.split("맞았습니다").length > 2;
  } catch (e) {
    return ("# Parsing Error");
  }
}

function foodFind(day) {
  try {
    var result = getweb("https://www.hanyang.ac.kr/web/www/re8").split("중식/석식")[4].split("[tab2]")[0].replace(/amp;/g, "").split("-->");
    return ("《 행파 》" + blank + "\n" + result[day - 1]);
  } catch (e) {
    return ("# Parsing Error");
  }

}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  if (room_name.indexOf(room) != -1) {
    msg = msg.trim();
    if (msg[0] != '#') {
      return;
    }

    var input = msg.split(" ")[0];
    var data = msg.replace(input + " ", "");

    if (input == "#song") {
      var text = song_find(data);
      replier.reply(text);
      return;
    }

    else if (input == "#행파") {
      var day = new Date().getDay();
      var text = foodFind(day);
      replier.reply(text);
      return;
    }

    else if (input == "#boj") {
      if (checkProblem(data) == false) {
        replier.reply("# No Problem " + data + "!");
        return;
      }

      replier.reply("boj.kr/" + data);
      var text = getBojProblem(data) + '\nmade by ★';
      replier.reply(text);
      return;
    }

    else if (input == "#ds") {
      if (data in id) {
	var SolveCount = daySolve(id[dat]);
        var text = data + "아 오늘은 " + SolveCount + "문제 풀었니?";
        replier.reply(text);
        replier.reply(SolveCount <= 2 ? "동근이가 널 찾고 있단다" : "참 잘했어요! 도장 쾅");
        return;
      }

      else {
        replier.reply("# 등록되지 않은 사용자입니다.");
        return;
      }
    }

    else if (input == "#cs") {
      data = data.split(" ");
      if (data.size != 2) {
      	replier.reply("Wrong Input!");
	return;
      }
      if (checkProblem(data[1]) == false) {
        replier.reply("# No Problem " + data[1] + "!");
        return;
      }
      if (data[0] in id) {
        var solved = checkSolve(id[data[0]], data[1]);
        replier.reply(solved ? "풀었습니다!" : "새로운 문제는 언제나 환영이야!");
        return;
      }
      else {
        replier.reply("# 등록되지 않은 사용자입니다.");
        return;
      }
    }
  }
}
