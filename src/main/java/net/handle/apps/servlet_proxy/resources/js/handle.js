document.getElementById('identifier').focus();
let providersData = [];
document.addEventListener('DOMContentLoaded', () => {
    const providerDropdown = document.getElementById("id");
    const resModeDropdown = document.getElementById("res_mode");
    const selectedValueInput = document.getElementById("identifier");
    const clearBtn = document.getElementById('clear');
    const submitBtn = document.getElementById('submit');
    const doiOnlyOptionIds = ['bibtex', 'citation', 'rdf', 'turtle'];
    selectedValueInput.value = '';
    const resModeOptions = [
      ["landingpage", "Landing Page", "landingpage"],
      ["metadata", "Metadata", "metadata"],
      ["resource", "Resource", "resource"],
      ["cn_bibtex", "BibTeX", "bibtex"],
      ["cn_rdf", "Citeproc", "citation"],
      ["cn_citation", "RDF XML", "rdf"],
      ["cn_turtle", "RDF Turtle", "turtle"]
    ];
    buildResModeDropdown(resModeOptions);
    if (selectedValueInput) {
        selectedValueInput.value = '';
    }
    clearBtn.addEventListener('click', () => {
        if (selectedValueInput) {
          selectedValueInput.value = '';
        }
        if (providerDropdown) {
          providerDropdown.selectedIndex = 0;
        }
        if (resModeDropdown) {
            resModeDropdown.selectedIndex = 0;
            Array.from(resModeDropdown.options).forEach((opt, idx) => {
              if (idx === 0) {
                opt.hidden = false;
                opt.disabled = false;
              } else {
                opt.hidden = true;
                opt.disabled = true;
              }
            });
        }
        if (submitBtn) {
          submitBtn.disabled = true;
        }
    });
    selectedValueInput.addEventListener('input', updateSubmitButtonState);
    resModeDropdown.addEventListener('change', updateSubmitButtonState);
    fetch('./syncProviders')
        .then(response => response.json())
        .then(data => {
                providers = data.content || [];
                providers.forEach(provider => {
                    const option = document.createElement("option");
                    option.textContent = provider.type;
                    option.value = provider.examples?.[0] || '';
                    option.className = "id";
                    providerDropdown.appendChild(option);
                });
                document.getElementById("providerCountText").textContent = providers.length;
                selectedValueInput.addEventListener('input', () => {
                    const inputValue = selectedValueInput.value;
                    let matchedProvider = null;
                    for (let provider of providers) {
                        if (provider.regexes) {
                            for (let regexStr of provider.regexes) {
                                try {
                                    const regex = new RegExp(regexStr);
                                    if (regex.test(inputValue)) {
                                        matchedProvider = provider;
                                        break;
                                    }
                                } catch (e) {
                                    console.warn("Invalid Regex:", regexStr);
                                }
                            }
                        }
                        if (matchedProvider) break;
                    }
                    if (matchedProvider) {
                        for (let option of providerDropdown.options) {
                            if (option.textContent === matchedProvider.type) {
                                option.selected = true;
                                providerDropdown.dispatchEvent(new Event('change'));
                                break;
                            }
                        }
                    } else {
                        console.warn("No matching provider found for input.");
                    }
                });
                providerDropdown.addEventListener('change', () => {
                    const selectedValue = providerDropdown.value;
                    selectedValueInput.value = selectedValue;
                    let matchedProvider = null;
                    for (let provider of providers) {
                        if (provider.regexes) {
                            for (let regexStr of provider.regexes) {
                                try {
                                    const regex = new RegExp(regexStr);
                                    if (regex.test(selectedValue)) {
                                        matchedProvider = provider;
                                        break;
                                    }
                                } catch (e) {
                                    console.warn("Invalid Regex:", regexStr);
                                }
                            }
                        }
                        if (matchedProvider) break;
                    }
                    const allOptions = Array.from(resModeDropdown.options);
                    allOptions.forEach(opt => {
                        opt.hidden = true;
                        opt.disabled = true;
                    });
                    if (matchedProvider && matchedProvider.resolution_modes) {
                        const validModes = matchedProvider.resolution_modes.map(m => m.mode);
                        allOptions.forEach(opt => {
                            if (validModes.includes(opt.value)) {
                                opt.hidden = false;
                                opt.disabled = false;
                            } else {
                                opt.hidden = true;
                                opt.disabled = true;
                            }
                        });
                    } else {
                        allOptions.forEach(opt => {
                            opt.hidden = true;
                            opt.disabled = true;
                        });
                    }
                    if (matchedProvider.type === "doi") {
                        doiOnlyOptionIds.forEach(id => {
                            const el = document.getElementById(id);
                            if (el) {
                                el.hidden = false;
                                el.disabled = false;
                            }
                        });
                    }
                });
            })
        .catch(err => {
            console.error("Error loading provider list:", err);
        });
});

function buildResModeDropdown(resModeOptions) {
  const resModeDropdown = document.getElementById("res_mode");
  resModeDropdown.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.textContent = 'Please select...';
  placeholder.value = '';
  placeholder.selected = true;
  placeholder.disabled = true;
  resModeDropdown.appendChild(placeholder);
  resModeOptions.forEach(([value, label, id]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.id = id;
    option.hidden = true;
    option.disabled = true;
    resModeDropdown.appendChild(option);
  });
}

function updateSubmitButtonState() {
  const input = document.getElementById('selectedValue');
  const dropdown = document.getElementById('res_mode');
  const submitBtn = document.getElementById('submit');
  const inputHasValue = input && input.value.trim() !== '';
  const dropdownHasSelection = dropdown && dropdown.value !== '' && dropdown.selectedIndex !== -1;
  submitBtn.disabled = !(inputHasValue && dropdownHasSelection);
}

function updateSubmitButtonState() {
    const input = document.getElementById('identifier');
    const dropdown = document.getElementById('res_mode');
    const submitBtn = document.getElementById('submit');
    const inputHasValue = input && input.value.trim() !== '';
    const dropdownHasSelection = dropdown && dropdown.value !== '' && dropdown.selectedIndex !== -1;
    if (inputHasValue && dropdownHasSelection) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
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
