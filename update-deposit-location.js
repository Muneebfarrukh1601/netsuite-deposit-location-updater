/**
 *
 */

function main(){
	try{
		var search = nlapiLoadSearch('transaction',622);
		var res = search.runSearch();
		var results = res.getResults(0,150);
		if(results && results.length>0){
			for(var i=0;i<results.length;i++){
				var type = 'deposit';
				var id = results[i].getId();//results[i].getValue('internalid');
				updateTransaction(type,id);

			}
		}		
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func main',ex.toString());
	}
}

function updateTransaction(type,id){
	try{
		nlapiLogExecution('DEBUG','type : ' + type,'id : ' + id);
		
		var rec = nlapiLoadRecord(type,id);
		rec.setFieldValue('location','');

			var lineType1 = 'other';
			var lineType2 = 'cashback';
			//var lineType3 = 'payment';			
			
			var lineCount1 = rec.getLineItemCount(lineType1);
			var lineCount2 = rec.getLineItemCount(lineType2);
			//var lineCount3 = rec.getLineItemCount(lineType3);
			
			if(lineCount1 > 0){
				updateLines(rec,lineType1,lineCount1);
			}
			if(lineCount2 > 0){
				updateLines(rec,lineType2,lineCount2);
			}
			//if(lineCount3 > 0){
			//	updateLines(rec,lineType3,lineCount3);
			//}
		
		nlapiSubmitRecord(rec);
	}
			
	catch(ex){
		nlapiLogExecution('ERROR','error in func updateTransaction',ex.toString());
	}
}

function updateLines(rec,lineType,lineCount){
	try{
		nlapiLogExecution('DEBUG','lineType '+lineType,'lineCount '+lineCount);
		for(var j=1; j<=lineCount;j++){
				rec.setLineItemValue(lineType,'location',j,'');
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func updateLines', ex.toString());
	}
}

function getLineType(rec){
	try{
		var count = rec.getLineItemCount('expense');
		if(count>0)
		{
			return 'expense';
		}
		else{
			return 'item';
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func',ex.toString());
	}
}
