document.getElementById('identifier').focus();

document.getElementById("identifier").addEventListener("input", processHandleOnPaste);
function processHandleOnPaste() {
    var identifier = document.getElementById("identifier").value;
    if (identifier.includes("/")) {
        var prefix = identifier.split("/")[0];
    }
    if (!identifier.includes("21.") && prefix.length != 5) {
        if (!identifier.includes("21.T11973/MR@")) {
            identifier = identifier.trim()
        }
        if (!identifier.includes("?landingpage")) {
            identifier = identifier + "?landingpage"
        }
        if (identifier.includes("urn:nbn:fi")) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.includes("ark:")) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.includes("arXiv") || identifier.includes("swh:") || identifier.includes("zenodo") || identifier.includes("urn:nbn:de")) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=false;
        }
        if (identifier.includes("doi:10.") && !identifier.includes("zenodo")) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=false;
        }
    }

    if (prefix.length == 5) {
        document.getElementById("metadata").disabled=false;
        document.getElementById("resource").disabled=true;
    }

    if (!!identifier) {
        document.getElementById("identifier").value = identifier;
        let displayMode = document.getElementById("landingpage");
        displayMode.checked = true;
    }
}

document.getElementById("clear").addEventListener("click", clearIdentifier);
function clearIdentifier() {
	document.getElementById("identifier").value = "";
	document.getElementById("noredirect").checked = false;
	document.getElementById('identifier').focus();
	var displays = document.getElementsByClassName("display");
    for (var i=0; i < displays.length; i++) {
        if (displays[i].checked) {
            displays[i].checked = false;
        }
        displays[i].disabled=false;
    }
	var ids = document.getElementsByClassName("id");
    for (var i=0; i < ids.length; i++) {
        if (ids[i].checked) {
            ids[i].checked = false;
        }
    }
}

var templateHandleIds = document.getElementsByClassName("id");
for (var i=0; i < templateHandleIds.length; i++) {
    templateHandleIds[i].onclick = function(){
        let identifier = this.value;
        if (!!identifier) {
            if (identifier.includes("urn:nbn:de")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=false;
            }
            if (identifier.includes("urn:nbn:fi")) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.includes("swh:")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=false;
            }
            if (identifier.includes("ark:")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.includes("arXiv") || identifier.includes("zenodo")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=false;
            }
            if (identifier.includes("21.")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.includes("doi:10.") && !identifier.includes("zenodo")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=false;
            }
            document.getElementById("identifier").value = identifier;

            if (!identifier.includes("21.")) {
                document.getElementById("identifier").value = identifier;
//                document.getElementById("identifier").value = identifier + '?' + "landingpage";
                document.getElementById("display").value = "landingpage";

            } else {
                document.getElementById("identifier").value = identifier;
            }
            document.getElementById("landingpage").checked = true;
            document.getElementById("noredirect").checked = false;
        }
    }
}

