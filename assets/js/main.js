
	var flag=true;//新增或者修改标记(新增:true;修改:false;)
	var datatable=null;
	var db=openDatabase('MyData','','My Database',102400);
	var saw = false;
	//初始化页面，显示之前添加的日志
	function init(){
		datatable=$("#datatable");
	    //显示日志数据
	    //判断IP
		var k = 1,s;
		db.transaction(function(tx){
		    //创建表
		    tx.executeSql('create table if not exists log1(id INTEGER PRIMARY KEY AUTOINCREMENT,content text,logDate integer,proName textarea)',[]);
		    //查询日志
		    tx.executeSql('select * from log1 order by logDate',[],function(tx,ts){
		        s = ts.rows.length;
		        showAllData();
		        if (s < k) {
		            var logDate1, proName1, content1;
		            logDate1 = "2019-02-14";
		            proName1 = "C++";
		            content1 =
                        "What a wonderful day!" + '\n' +

                "Great！" + '\n' +

                "今天，" + '\n' +

                "本 站 终 于 建 站 了！" + '\n' +

                "————————————————————" + '\n' +
                "欢 迎 各 位 大 佬 有 空 时 多 多 光 顾 本 站 哦~" + '\n' +
                "————————————————————" + '\n' +

                "手 动 分 割（嘻嘻嘻嘻嘻~）" + '\n' +

                "好 吧。" + '\n' +

                "就 这 样 了。" + '\n' +

                "记 录 下这 美 好  的 一 天。" + '\n' +

                "以 后 会 一 段 时 间 更 新 一 次 的。" + '\n' +

                "溜 了 溜 了" + '\n' +
                "。。。。。" + '\n' +
                "。。。。。。。。" + '\n' +
                "。。。。。。。。。。。" + '\n' +
                "。。。。。。。。。。。。。。" + '\n' +
                "。。。。。。。。。。。。。。。。。"
		            ;
		            addData(logDate1, proName1, content1);
		            showAllData();
		        }
		    });
		});
	}
	function inline() {
	    var logDate = "2019-02-14";
	    var proName = "C++";
	    var content = "。。。。。。。。。。。。。。。。。";
	    var logId = parseInt($('#logId').val());
	    var message = "";
	    //保存时校验
	    if (logDate == "") {
	        message += "请选择日志日期!\n";
	    }
	    if (proName == "") {
	        message += "请选择项目名称!\n";
	    }
	    if (content == "") {
	        message += "请输入日志内容!\n";
	    }
	    if (message != "") {
	        alert(message);
	        return false;
	    }
	    if (flag) {
	        addData(logDate, proName, content);


	    } else {
	        updateData(logId, logDate, proName, content);
	    }
	    clearData();
	    showAllData();
	    //延迟加载统计图
	    setTimeout(function () { drawTable(); }, 230);
	}
	
	
	//在canvas上画日记工时统计图
	function drawStatLine(ctx){

		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.strokeStyle="#ff8040";
		ctx.lineWidth="3";
		for(var i=0;i<localStorage.length;i++){
			var key=localStorage.key(i);
			var value=localStorage.getItem(key);
			//alert(value);
			if(i==0){
				ctx.moveTo(0,500-value*50);
				ctx.font="bold 20px Arial";
				ctx.fillText(value,0,500-value*50);
				
			}else{
				ctx.lineTo(i*100,500-value*50);
				ctx.font="20px Arial";
				ctx.fillText(value,i*100,500-value*50);
			}
			
		}
		ctx.stroke();	
		ctx.closePath();
	}

	
	//移除所有数据
	function removeAllData(){
				

		//先删除表中所有行
		$("#datatable tr").remove();
		datatable.append("<tr><th width=\"5%\">序号</th><th  width=\"10%\">日志日期</th><th  width=\"20%\">项目名称</th><th  width=\"40%\">日志内容</th></tr>");
	}

	//显示一行数据
	function showData(num,row){
		datatable.append("<tr><td><input type=\"hidden\" name=\"logId\" value=\""+row.id+"\" />"+num+"</td><td>"+row.logDate+"</td><td>"+row.proName+"</td><td>"+row.content+"</td></tr>");
		
	}

	//改变行显示的颜色和背景颜色
	function changeColor(){
		$("#datatable th").addClass("th");
		$("#datatable tr:odd").addClass("odd");
		$("#datatable tr:even").addClass("even");
		$("#datatable tr").hover(
			function(){
				$(this).addClass("hover");
			},
			function(){
				$(this).removeClass("hover");
			}
	   );
		 $("#datatable tr").click(
			function(){
				$("#datatable tr").removeClass("click");
				$(this).addClass("click");	//点击一行颜色变化

			}
	   );
	}
	
	

	//显示所有数据
	function showAllData(){
		db.transaction(function(tx){
			//创建表
			tx.executeSql('create table if not exists log1(id INTEGER PRIMARY KEY AUTOINCREMENT,content text,logDate integer,proName textarea)',[]);
			//查询日志
			tx.executeSql('select * from log1 order by logDate',[],function(tx,ts){
				//先移除所有数据
				removeAllData();
				localStorage.clear();
				for(var i=0;i<ts.rows.length;i++){
					//alert(ts.rows.length);
					showData(i+1,ts.rows.item(i));
					
				}
				//改变显示颜色
				changeColor();
			});
		});
	}


	//新增一条数据到数据库
	function addData(logDate,proName,content){
		//alert("新增一条数据到数据库");
		db.transaction(function(tx){
			tx.executeSql('insert into log1(content,logDate,proName) values(?,?,?)',[content,logDate,proName],function(tx,rs){
			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
		
	}

	//更新一条数据库数据
	function updateData(logId,logDate,proName,content){
		//alert("更新一条数据："+logId);
		db.transaction(function(tx){
			tx.executeSql('update log1 set logDate=?,proName=?,content=? where id=?',[logDate,proName,content,logId],function(tx,rs){
			   alert("成功修改一条数据！！");
			},function(tx,error){
				alert(error.source+"::"+error.message);
			});
		});
	}

	//数据库中删除一条数据
	function deleteData(logId){
		db.transaction(function(tx){
			tx.executeSql('delete from log1 where id=?',[logId],function(tx,rs){
				alert("成功删除日志！！");
			},function(tx,error){
				alert(error.source+"::"+error.message);		
			}
			);
		});
	}
	
	


	//点击保存按钮 保存/更新数据
	function saveData(){
		var logDate=$('#logDate').val();
		var proName=$('#proName').val();
		var content=$('#content').val();
		var logId=parseInt($('#logId').val());
		var message="";
		//保存时校验
		if(logDate==""){
			message+="请选择日志日期!\n";
		}
		if(proName==""){
			message+="请选择项目名称!\n";
		}
		if(content==""){
			message+="请输入日志内容!\n";
		}		
		if(message!=""){
			alert(message);		
			return false;
		}		
		if(flag){
			addData(logDate,proName,content);
			
			
		}else{
			updateData(logId,logDate,proName,content);
		}
		clearData();
		showAllData();
		//延迟加载统计图
		setTimeout(function(){drawTable();},230);

	}
    //**
	function Loadtext() {
	    $('#Nowtxtnum').val($("#datatable .click td:eq(2)").html());
	    $('#Nowtxtdate').val($("#datatable .click td:eq(1)").html());
	    $('#Nowtxtword').val($("#datatable .click td:eq(3)").html());
	}

	//点击修改按钮 修改数据
	function editData(){
		flag=false;
		var logId=$("#datatable .click  input").val();
		$('#logDate').val($("#datatable .click td:eq(1)").html());
		$('#proName').val($("#datatable .click td:eq(2)").html());
		$('#content').val($("#datatable .click td:eq(3)").html());
		$('#logId').val(logId);
	}

	//点击新增/重置按钮 新增数据vs重置数据
	function clearData(){
	    $('#logId').val("");
		$('#logDate').val("");
		$('#proName').val("");
		$('#content').val("");
		flag=true;
	}

	//点击删除按钮 删除数据
	function delData(){
		var logId=$("#datatable .click  input").val();;
		$('#logId').val(logId);
		if(confirm("确定要删除此条日志吗？")){
				deleteData(logId);
		}
		showAllData();

	}

