document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inputs");
    const generateBtn = document.getElementById("generate-btn");
    const resumePreview = document.getElementById("resume-preview");
    const templateSelector = document.getElementById("template-selector");
    const photoUpload = document.getElementById("photo-upload");
    const profilePic = document.getElementById("profile-pic");
    const resume = document.getElementById("res");

    updateResume();
    
    // Generate Resume
    generateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (validateForm()) {
            updateResume();
            resumePreview.style.display = "block";
        } else {
            alert("Please fill in all required fields!");
        }
    });

    // Download PDF
    document.getElementById("download-pdf").addEventListener("click", async function() {
    document.getElementById("resume-preview").style.display = "block";
    
    const element = document.getElementById("res").cloneNode(true);
    element.style.display = "block";
    element.style.visibility = "visible";
    element.style.opacity = "1";
    document.body.appendChild(element);
    
    const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please check console for details.");
    } finally {
        document.body.removeChild(element);
    }
});

    // Change Template
    templateSelector.addEventListener("change", () => {
        resume.classList.remove("modern", "classic", "minimal");
        resume.classList.add(templateSelector.value);
        console.log("Template changed to:", templateSelector.value);
    });

    // Photo Upload
    photoUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePic.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Setup Drag and Drop
    setupDragAndDrop();

    // Update Resume Preview
    function updateResume() {
        document.getElementById("res-name").textContent = form.name.value;
        document.getElementById("res-title").textContent = form.title.value;
        document.getElementById("res-summary").textContent = form.summary.value;
        document.getElementById("res-work").textContent = form.work.value;
        document.getElementById("res-education").textContent = form.education.value;
        document.getElementById("res-skills").textContent = form.skills.value;
        
        // Contact Info
        const contactInfo = [
            form.phone.value ? `Phone: ${form.phone.value}` : "",
            form.email.value ? `Email: ${form.email.value}` : "",
            form.linkedin.value ? `LinkedIn: ${form.linkedin.value}` : "",
            form.github.value ? `GitHub: ${form.github.value}` : ""
        ].filter(Boolean).join("\n");
        
        document.getElementById("res-contact").textContent = contactInfo;
    }

    // Form Validation
    function validateForm() {
        let isValid = true;
        const requiredFields = ["name", "title", "skills", "email"];
        
        requiredFields.forEach(field => {
            if (!form[field].value.trim()) {
                form[field].style.border = "1px solid red";
                isValid = false;
            } else {
                form[field].style.border = "1px solid #ddd";
            }
        });
        
        return isValid;
    }

    // Drag & Drop Setup
    function setupDragAndDrop() {
        const sections = document.querySelectorAll(".res-section");
        const zones = document.querySelectorAll(".draggable-zone");
        let draggedSection = null;

        sections.forEach(section => {
            section.addEventListener("dragstart", () => {
                draggedSection = section;
                setTimeout(() => section.style.opacity = "0.4", 0);
            });

            section.addEventListener("dragend", () => {
                setTimeout(() => {
                    section.style.opacity = "1";
                    draggedSection = null;
                }, 0);
            });
        });

        zones.forEach(zone => {
            zone.addEventListener("dragover", e => {
                e.preventDefault();
                zone.classList.add("drag-over");
            });

            zone.addEventListener("dragleave", () => {
                zone.classList.remove("drag-over");
            });

            zone.addEventListener("drop", e => {
                e.preventDefault();
                zone.classList.remove("drag-over");
                if (draggedSection && zone !== draggedSection.parentNode) {
                    zone.appendChild(draggedSection);
                }
            });
        });
    }
});