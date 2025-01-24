// KSNVTools - scripts.js

// Function to initialize the tool
function initializeTool() {
  console.log("KSNVTools initialized");
  // Add your initialization code here
}

// Call the initialize function when the script loads
initializeTool();

function converColumnToRow(){
  var input = $("#input").val();
  var output = input.split(" ").join(",");
  $("#output").val(output);
}

$("#input").on("change keyup paste", function(){
  converColumnToRow();
})