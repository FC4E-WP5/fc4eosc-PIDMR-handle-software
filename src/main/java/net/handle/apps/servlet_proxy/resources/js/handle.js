document.getElementById('identifier').focus();

document.getElementById("identifier").addEventListener("input", processHandleOnPaste);
function processHandleOnPaste() {
    var identifier = document.getElementById("identifier").value;
    if (identifier.includes("/")) {
        var prefix = identifier.split("/")[0];
    }
    if (!!identifier) {
        if (!identifier.includes("21.T11973/MR@")) {
            identifier = identifier.trim()
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
        if (identifier.includes("21.")) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.match(/^10\.\d+\/.+$/) || identifier.match(/(d|D)(o|O)(i|I):10\.\d+\/.+$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=false;
        }
        if (identifier.match(/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.match(/^([a-z][a-z\-]*(?:\.[a-z][a-z\-]*)?(?:\.[0-9]*)?)$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.match(/^([0-9]{1,5})$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.match(/^(0[0-9a-zA-Z]{6}[0-9]{2})$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        if ((identifier.match(/^10\.\d+\/.+$/) || identifier.match(/(d|D)(o|O)(i|I):10\.\d+\/.+$/)) && !identifier.includes("zenodo")) {
            document.getElementById("content-negotiation-title").style.display = "block";
            document.getElementById("content-negotiation-bibtex").style.display = "block";
            document.getElementById("content-negotiation-citation").style.display = "block";
            document.getElementById("content-negotiation-turtle").style.display = "block";
            document.getElementById("content-negotiation-rdf").style.display = "block";
        } else {
            document.getElementById("content-negotiation-title").style.display = "none";
            document.getElementById("content-negotiation-bibtex").style.display = "none";
            document.getElementById("content-negotiation-citation").style.display = "none";
            document.getElementById("content-negotiation-turtle").style.display = "none";
            document.getElementById("content-negotiation-rdf").style.display = "none";
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
            if (identifier.match(/^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.match(/^([a-z][a-z\-]*(?:\.[a-z][a-z\-]*)?(?:\.[0-9]*)?)$/)) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.match(/^([0-9]{1,5})$/)) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.match(/^(0[0-9a-zA-Z]{6}[0-9]{2})$/)) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.includes("doi:10.") && !identifier.includes("zenodo")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=false;
            }
            if (identifier.includes("doi:10.")) {
                document.getElementById("content-negotiation-title").style.display = "block";
                document.getElementById("content-negotiation-bibtex").style.display = "block";
                document.getElementById("content-negotiation-citation").style.display = "block";
                document.getElementById("content-negotiation-turtle").style.display = "block";
                document.getElementById("content-negotiation-rdf").style.display = "block";
            } else {
                document.getElementById("content-negotiation-title").style.display = "none";
                document.getElementById("content-negotiation-bibtex").style.display = "none";
                document.getElementById("content-negotiation-citation").style.display = "none";
                document.getElementById("content-negotiation-turtle").style.display = "none";
                document.getElementById("content-negotiation-rdf").style.display = "none";
            }
            document.getElementById("identifier").value = identifier;

            if (!identifier.includes("21.")) {
                document.getElementById("identifier").value = identifier;
                document.getElementById("display").value = "landingpage";
            } else {
                document.getElementById("identifier").value = identifier;
            }
            document.getElementById("landingpage").checked = true;
            document.getElementById("noredirect").checked = false;
        }
    }
}

var displayElements = document.getElementsByClassName("display");
for (var i = 0; i < displayElements.length; i++) {
    displayElements[i].onclick = function(){
        let display = this.value;
        var identifier = document.querySelector("input[type='text'][name='hdl']").value;
        if (!!identifier) {
            if (identifier.includes("21.")) {
                document.getElementById('identifier').value = identifier;
                document.getElementById('display').value = "";
                if (display == "metadata") {
                    document.getElementById('noredirect').checked = true;
                } else {
                    document.getElementById('noredirect').checked = false;
                }
            } else {
                document.getElementById('identifier').value = identifier;
                document.getElementById('display').value = display;
            }
        }
    }
}