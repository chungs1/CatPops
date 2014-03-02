var socket = io.connect();
var number = 0;

var name;
$(document).ready(function() {
	//$(".chat").hide();
});

socket.on("cat_callback", function(data) {
	var pic = document.createElement("img");
	pic.src = data;
	pic.id = number;
	pic.height = pic.height*.15;
	pic.width = pic.width*.15;
	$("#catbox").append(pic);
	console.log("hiasdfdkhjk");
	$("#catbox").scrollTop($("#catbox")[0].scrollHeight);
	Prep(number);
	number+=1;
});


$("#chatbox").keypress(function(e) {
	return false;
});

$("#chatbox_content").keypress(function(e) {
	if(e.which == 13) {
		var content = $("#chatbox_content").val();
		if(content != '') {
			var message = "<p>" + content + "</p>";
			$('#catbox').append(message);
			$("#chatter").scrollTop($("#catbox")[0].scrollHeight);
			socket.emit('cat_message', message);
			$("#catbox_content").val("");
		}
	}
});
            
function Prep(number){
    window_Height = window.innerHeight;
    window_Width = window.innerWidth;
    
    image_Element = document.getElementById(number);
    image_Height = image_Element.clientHeight;
    image_Width = image_Element.clientWidth;
    
    availSpace_V = window_Height - image_Height;
    availSpace_H = window_Width - image_Width;
    
    var changeInterval = 3000; // Time has to be in miliseconds. So, 3000 is 3 seconds
    setInterval(moveImage(), changeInterval);
}

function moveImage(){
    var randNum_V = Math.round(Math.random() * availSpace_V);
    var randNum_H = Math.round(Math.random() * availSpace_H);
    
    image_Element.style.top = randNum_V + "px";
    image_Element.style.left = randNum_H + "px";
}

