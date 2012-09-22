/* 
Chat YS 1.0
@author Yusuf Doru - www.yusufdoru.com 
*/

$(Document_Loaded);
var socket = io.connect('http://127.0.0.1:3000');

socket.on('updatechat', function (data) {
	 addMsgLine(data);
});

function Document_Loaded(){
	$("#txtnick").keydown(txtnick_keydown);	
	$("#btnstart").click(btnstart_click);	
	
	$("#txtchat").keydown(txtchat_keydown);	
	$("#chatside,#txtchat").hide();

	$("#colors li a").click(function()
	{
		$.each($(this),function(i,e)
		{
			$("#colors li a").html("");
			$("#colors li a").attr("class","");
		});
		$(this).html("ᴥ");
		$(this).addClass("selected");
	});
}

/***************** Events *****************/
function btnstart_click()
{
	$("#chatside,#txtchat").show("fast");	
	$("#userside").hide("fast");
	
	socket.emit('adduser',$("#txtnick").val(),$("#colors li .selected").attr("title"),function(data){
		addMsgLine(data);
	});
	

}
function txtchat_keydown(e)
{
	if(e.keyCode == "13")
	{		
		if($(this).val() != "")
		{
			send_msg($(this).val());
			$(this).val("");
		}
	}
}

function txtnick_keydown(e)
{
	if(e.keyCode == "13") btnstart_click();
}

/***************** Functions *****************/
function send_msg(msg)
{	
	socket.emit('sendmsg',msg,function(data){
		addMsgLine(data);

	});
}
function addMsgLine(data)
{	
	$("#chatside ul").append("<li><span style='color:"+data.color+";'>"+data.nick+" :</span><span style='margin:0 10px; color:"+data.color+";'>"+data.msg+"</span></li>");
	$("#chatside").scrollTop($("#chatside ul").height());
}