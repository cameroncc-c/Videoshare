//The URIs of the REST endpoint
IUPS = "https://prod-21.eastus.logic.azure.com:443/workflows/2086d86c2aab4595bee2e6bcf972e6e4/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=s3zPzr4VbGFeN4lYsBLjnZyB34AGDaWhgd_KXPgL4f8";
RAI = "https://prod-08.eastus.logic.azure.com:443/workflows/efd34f44bc1f4b0f9d17003f7566662d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RFkrQpbVu3c-LRs-bwij0HmIz5Bp8lv-piezBkeeUaE";

DIAURI0 = "https://prod-88.eastus.logic.azure.com/workflows/f551cc9bd60540d883455c6e4e79d104/triggers/manual/paths/invoke/rest/v1/videos/";
DIAURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KNr7caH5oh8gPS9GFpbMKGZoV6rxjgmVPBKjnG1vkUA";

BLOB_ACCOUNT = "https://blobstoragevideo.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retVideos").click(function(){

      //Run the get asset list function
      getVideos();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();


    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
 
  //Create a form data object
  submitData = new FormData();

  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());  
  submitData.append('File', $("#UpFile")[0].files[0]); 
  
  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({ 
    url: IUPS, 
    data: submitData, 
    cache: false, 
    enctype: 'multipart/form-data', 
    contentType: false, 
    processData: false, 
    type: 'POST', 
    success: function(data){ 
  } 
 });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideos(){

  //Replace the current HTML in that div with a loading message
   $('#VideoList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
   
   $.getJSON(RAI, function( data ) {
   
    //Create an array to hold all the retrieved assets
    var items = [];
    
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each( data, function( key, val ) {

      items.push( "<hr />");
      items.push("<video width='400' controls><source src='"+BLOB_ACCOUNT + val["filepath"] +"' /></video><br />") 
      items.push( "File : " + val["fileName"] + "<br />");
      items.push( "Publsihed by: " + val["publisher"] + " (Producer: "+val["producer"]+")<br />");
      items.push('<button type="button" id="subNewForm" class="btn btn-danger" onclick="deleteAsset('+val["fileName"] +')">Delete</button> <br/><br/>');
      items.push( "<hr />");
    });

    //Clear the assetlist div 
    $('#VideoList').empty();

    //Append the contents of the items array to the VideoList Div
    $( "<ul/>", {
      "class": "my-new-list", 
      html: items.join( "" ) 
    }).appendTo( "#VideoList" );
  });
} 

//A function to delete an asset with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteAsset(id){
    
  $.ajax({ 

    type: "DELETE",
    //Note the need to concatenate the 
    url: DIAURI0 + id + DIAURI1,

  }).done(function( msg ) {
    //On success, update the assetlist.
    getVideos();
  });
  
}

