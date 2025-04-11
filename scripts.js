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
  var outputComma = input.split(" ").join(",");
  $("#outputComma").val(outputComma);
  var outputSpace = input.split(" ").join(" ");
  $("#outputSpace").val(outputSpace);
}

$("#input").on("change keyup paste", function(){
  converColumnToRow();
})

function copyToClipboardComma() {
  var output = $("#outputComma").val();
  navigator.clipboard.writeText(output).then(function() {
    console.log("Copied to clipboard: " + output);
  }, function(err) {
    console.error("Could not copy text: ", err);
  });
}

function copyToClipboardSpace() {
  var output = $("#outputSpace").val();
  navigator.clipboard.writeText(output).then(function() {
    console.log("Copied to clipboard: " + output);
  }, function(err) {
    console.error("Could not copy text: ", err);
  });
}