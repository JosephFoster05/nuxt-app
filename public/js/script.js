window.generateHamburgerLinks = function () {
    try {
        const visor = document.getElementById('hamburgerLinksVisor')
        if (!visor) return
        // toggle
        if (visor.style.display === 'block' || getComputedStyle(visor).display === 'block') {
            visor.style.display = 'none'
        } else {
            visor.style.display = 'block'
        }
    } catch (e) {
        console.warn('generateHamburgerLinks error', e)
    }
}

window.addEventListener('click', function (e) {
    const visor = document.getElementById('hamburgerLinksVisor')
    if (!visor) return
    const target = e.target
    if (target.tagName === 'A' && target.closest('#hamburgerLinks')) {
        visor.style.display = 'none'
    }
})
