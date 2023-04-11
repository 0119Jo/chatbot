/**
 * web socket
 */

function getId(id){
	return document.getElementById(id);
}

var data = {};//전송 데이터(JSON)

//해당 변수들은 chatting.jsp의 id 값 참고
var ws ;
var mid = getId('mid');
var btnLogin = getId('btnLogin');
var btnSend = getId('btnSend');
var talk = getId('talk');
var msg = getId('msg');

//로그인을 클릭해서 접속, 웹소켓의 ws://localhost/chatt 여기서 /chatt 은 ServerEndpoint의 value = "/chatt"
btnLogin.onclick = function(){
	ws = new WebSocket("ws://" + location.host + "/chatt");
	//WebSocketChatt.java의 onmessage 
	ws.onmessage = function(msg){
		//msg.data를 JSON.parse를 이용하여 JavaScript 객체로 변환
		// {"mid":"홍길동3","msg":"ㅎㅇ","date":"2023. 4. 11. 오후 10:24:07"} -> data.mid = "홍길동", data.msg = "ㅎㅇ", data.date = "2023. 4. 11. 오후 10:24:07"
		var data = JSON.parse(msg.data);
		var css;
		//data.mid와 mid.value가 같으면 class=me, 다르면 class=other 여기서 mid.value는 세션에 있는 로그인한 값.
		if(data.mid == mid.value){
			css = 'class=me';
		}else{
			css = 'class=other';
		}
		// 홍길동3 [ 2023. 4. 11. 오후 10:24:07 ] 로 표기하기 위한 HTML 
		var item = `<div ${css} >
		                <span><b>${data.mid}</b></span> [ ${data.date} ]<br/>
                      <span>${data.msg}</span>
						</div>`;
		//innerHTML HTML에 넣는 방식			
		talk.innerHTML += item;
		talk.scrollTop=talk.scrollHeight;//스크롤바 하단으로 이동
	}
}
//엔터키로 전송
msg.onkeyup = function(ev){
	if(ev.keyCode == 13){
		send();
	}
}
//전송 버튼을 마우스로 클릭했을 때 전송
btnSend.onclick = function(){
	send();
}

function send(){
	//msg.value에서 trim()으로 양쪽 끝의 공백을 제거한 값이 '' 이 아니라면 
	if(msg.value.trim() != ''){
		//data.mid = 로그인한 아이디
		data.mid = getId('mid').value;
		//data.msg  = 메시지 내용
		data.msg = msg.value;
		//data.date = 현재 시간
		data.date = new Date().toLocaleString();
		//temp 에 해당 data들을 json형식으로 변경
		var temp = JSON.stringify(data);
		//웹소켓으로 전송
		ws.send(temp);
	}
	msg.value ='';
	
}