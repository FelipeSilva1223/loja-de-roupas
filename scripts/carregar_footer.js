const footerTag = document.querySelector('footer')
footerTag.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-3', 'py-3')
footerTag.style.backgroundColor = "#0E2340";
footerTag.style.color = "#FAF3EB";

footerTag.insertAdjacentHTML('afterbegin', `
        <div>
            <p class="mb-0">Contatos</p>
            <a href="#" class="bi bi-whatsapp me-2 icone-footer" style="color: green;"></a>
            <a href="#" class="bi bi-instagram me-2 icone-footer" style="color: #E1306C;"></a>
            <a href="#" target="_blank" class="bi bi-facebook me-2 icone-footer" style="color: blue;"></a>
        </div>`)