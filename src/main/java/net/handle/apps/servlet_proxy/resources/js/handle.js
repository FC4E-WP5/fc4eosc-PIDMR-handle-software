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
        if (identifier.includes("urn:nbn:nl")) {
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
        if (identifier.match(/^([\d.]+)$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.match(/^((?:\d{3}-){4}\d)$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        if (identifier.match(/^\d{5,5}\/.+$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        // ISNI RegEX
        if (identifier.match(/^(\d{15}[1-9X])$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        // ISBN RegEX
        if (identifier.match(/^(?:97[89]-\d{1,5}-\d{1,7}-\d{1,7}-\d{1})$/)) {
            document.getElementById("metadata").disabled=false;
            document.getElementById("resource").disabled=true;
        }
        // Bibcode RegEX
        if (identifier.match(/^\d{4}[A-Za-z0-9&\.]{5}[A-Za-z0-9\.]{4}[A-Za-z0-9\.][A-Za-z0-9\.]{4}[A-Za-z]$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=false;
        }
        // BioSample RegEX
        if (identifier.match(/^SAM[NED](\w)?\d+$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        // Catalogue Of Life (COL) RegEX
        if (identifier.match(/^[23456789BCDFGHJKLMNPQRSTVWXYZ]{1,6}$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        // Cellosaurus Vocabulary Cell Line (CVCL) RegEX
        if (identifier.match(/^CVCL_[0-9A-Z]{4}$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }
        // The database of Genotypes and Phenotypes (dbGaP) RegEX
        if (identifier.match(/^(phs\d{6}\.v\d+\.\w\d+)$/)) {
            document.getElementById("metadata").disabled=true;
            document.getElementById("resource").disabled=true;
        }

        if ((identifier.match(/^10\.\d+\/.+$/) || identifier.match(/(d|D)(o|O)(i|I):10\.\d+\/.+$/)) && !identifier.includes("zenodo")) {
            document.getElementById("bibtex").style.display = "block";
            document.getElementById("citation").style.display = "block";
            document.getElementById("turtle").style.display = "block";
            document.getElementById("rdf").style.display = "block";
        } else {
            document.getElementById("bibtex").style.display = "none";
            document.getElementById("citation").style.display = "none";
            document.getElementById("turtle").style.display = "none";
            document.getElementById("rdf").style.display = "none";
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
            if (identifier.includes("urn:nbn:nl")) {
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
            if (identifier.match(/^([\d.]+)$/)) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.match(/^((?:\d{3}-){4}\d)$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.match(/^\d{5,5}\/.+$/)) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            if (identifier.includes("doi:10.") && !identifier.includes("zenodo")) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=false;
            }
            if (identifier.includes("doi:10.")) {
                document.getElementById("bibtex").style.display = "block";
                document.getElementById("citation").style.display = "block";
                document.getElementById("turtle").style.display = "block";
                document.getElementById("rdf").style.display = "block";
            } else {
                document.getElementById("bibtex").style.display = "none";
                document.getElementById("citation").style.display = "none";
                document.getElementById("turtle").style.display = "none";
                document.getElementById("rdf").style.display = "none";
            }
            // ISNI RegEx
            if (identifier.match(/^(\d{15}[1-9X])$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            // ISBN RegEX
            if (identifier.match(/^(?:97[89]-\d{1,5}-\d{1,7}-\d{1,7}-\d{1})$/)) {
                document.getElementById("metadata").disabled=false;
                document.getElementById("resource").disabled=true;
            }
            // Bibcode RegEX
            if (identifier.match(/^\d{4}[A-Za-z0-9&\.]{5}[A-Za-z0-9\.]{4}[A-Za-z0-9\.][A-Za-z0-9\.]{4}[A-Za-z]$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=false;
            }
            // BioSample RegEX
            if (identifier.match(/^SAM[NED](\w)?\d+$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            // Catalogue Of Life (COL) RegEX
            if (identifier.match(/^[23456789BCDFGHJKLMNPQRSTVWXYZ]{1,6}$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            // Cellosaurus Vocabulary Cell Line (CVCL) RegEX
            if (identifier.match(/^CVCL_[0-9A-Z]{4}$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            // The database of Genotypes and Phenotypes (dbGaP) RegEX
            if (identifier.match(/^(phs\d{6}\.v\d+\.\w\d+)$/)) {
                document.getElementById("metadata").disabled=true;
                document.getElementById("resource").disabled=true;
            }
            document.getElementById("identifier").value = identifier;
            document.getElementById("display").value = "landingpage";
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
            document.getElementById('identifier').value = identifier;
            document.getElementById('display').value = display;
        }
    }
}