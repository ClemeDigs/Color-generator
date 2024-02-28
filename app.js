//Définir une variable cells, qui est un tableau de tous les éléments html qui contiennent la class cell
let cells = document.querySelectorAll('.cell')
//Définir une variable button qui est un élément html du bouton qui contient la class button
let button = document.querySelector('.button');

//Définir la fonction getHue qui retourne un nombre entre 0 et 360
function getHue() {
    return Math.round(Math.random() * 360);
}

//Définir la fonction getPourcent qui retourne un nombre entre 20 et 80 (par souci d'esthétique j'ai enlevé les extrêmes)
function getPourcent() {
    return Math.round((Math.random() * 60) + 20);
}

//Définir la fonction getComplementary (avec en paramètre un nombre qui correspond à une couleur) qui retourne un nombre +180 si le nombre en paramètre est inférieur à 180, sinon elle retourne un nombre -180 (Correspond à la teinte complémentaire)
function getComplementary(color) {
    if (color < 180) {
        return color + 180;
    } else {
        return color - 180;
    }
}

//Définir la fonction getLight qui retourne un nombre + 15. Elle sera appliquée pour augmenter la luminosité d'une couleur
function getLight(color) {
    return color + 15;
}

//Définir la fonction getLight qui retourne un nombre - 15. Elle sera appliquée pour réduire la luminosité d'une couleur
function getDark(color) {
    return color - 15;
}

//Définir une fonction qui prend en paramètre les valeurs h, s, l (des nombres) et qui retourne un tableau de 3 nombres qui correspondent aux couleurs r, g, b. (Fonction compliquée que je suis allée chercher sur internet...)
function getRgbColors(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}


// Définir une fonction qui permet de convertir un nombre en 2 caractères (qui vont correspondre à la valeur en hexadécimal)
function decimalToHex(decimalNumber) {
    let hexadecimalNumber = decimalNumber.toString(16);
    if (hexadecimalNumber.length === 1) {
        return '0' + hexadecimalNumber;
    }
    return hexadecimalNumber;
}

//Définir une fonction qui va définir les couleurs en hsl: on définit une variable h qui appelle la fonction getHue, une autre variable h2 qui appelle la fonction getComplementary avec h en paramètre, et deux variables (s et l) qui appellent la fonction getPourcent et qui vont correspondre à la saturation et la luminosité de la couleur hsl. 
function getHslColors() {
    let h = getHue();
    let h2 = getComplementary(h);
    let s = getPourcent();
    let l = getPourcent();

    //Cette fonction retourne un tableau de 6 tableaux qui correspondent à 6 couleurs en hsl : une couleur de base, une complémentaire, une teinte plus claire et plus foncée pour chaque couleur (grace aux fonctions getLight et getDark)
    return [
        [h, s, l],
        [h2, s, l],
        [h, s, getLight(l)],
        [h2, s, getDark(l)],
        [h, s, getDark(l)],
        [h2, s, getLight(l)]
    ];
}

//Définir une fonction toHslCssValue qui retourne la façon correcte d'écrire une couleur hsl pour que le CSS la comprenne
function toHslCssValue(hslColors) {
    return 'hsl(' + hslColors[0] + ',' + hslColors[1] + '%,' + hslColors[2] + '%)';
}

//Lorsque le bouton est cliqué
button.addEventListener('click', () => {
    //Définir la variable hslColors au retour de la fonction getHslColors
    let hslColors = getHslColors();

    //Boucler à travers toutes les cellules
    for (let i = 0; i < cells.length; i++) {
        //Définir la variable cell = chacune des cellules à l'index de i du tableau d'éléments html cells
        let cell = cells[i];
        //Définir la variable color = la couleur hsl du tableau hslColors à l'index de i
        let color = hslColors[i];
        //Définir la variable rgbColors = retour de la fontion getRgbColors avec comme paramètres les 3 valeurs hue, saturation et luminosité (qu'on repère grace à leurs index) pour lesquelles on convertit la valeur en rgb
        let rgbColors = getRgbColors(color[0], color[1], color[2]);
        //Définir la variable fullRgbColor de type string concatainant rgb(nombres à l'index 0, 1 et 2 du tableau rgbColors, séparés d'une virgule. 
        let fullRgbColor = 'rgb(' + rgbColors[0] + ', ' + rgbColors[1] + ', ' + rgbColors[2] + ')';
        //Définir la variable fullHexColor de type string qui retourne une concataination de # et de chaque retour de la fonction decimalToHex (donc 2 caractères) pour chaque valeur de r, g, b (selon leur index)
        let fullHexColor = '#' + decimalToHex(rgbColors[0]) + decimalToHex(rgbColors[1]) + decimalToHex(rgbColors[2]);

         // Définir la couleur du texte pour chaque paragraphe dans la cellule. Si la luminosité (C'est à dire le tableau color à l'index de 2) est inférieure à 50, appliquer la couleur blanche, sinon, appliquer la couleur noire.
        let paragraphs = cell.querySelectorAll('p');
        for (let p of paragraphs) {
            if (color[2] < 50) {
                p.style.color = 'white';
            } else {
                p.style.color = 'black';
            }
        };

        //Changer la couleur de fond à chaque cellule grâce à la propriété style. On assigne la valeur de retour de la fonction toHslCssValue qui prend en paramètre la couleur hsl
        cell.style.backgroundColor = toHslCssValue(color);

        //Changer le texte de chaque paragraphe avec les valeurs de chaque couleur en selectionnant tous les paragraphes comportant la class 'hsl', 'rgb' ou 'hex' dans les cell
        cell.querySelector('.hsl').textContent = toHslCssValue(color);
        cell.querySelector('.rgb').textContent = fullRgbColor;
        cell.querySelector('.hex').textContent = fullHexColor;

        //Si le texte du bouton est égal à START, le changer pour RESET grace à la propriété textContent. Le bouton START ne sera donc visible que la première fois, quand aucune couleur n'est affichée.
        if (button.textContent = 'START') {
            button.textContent = 'RESET'
        }
    }
});