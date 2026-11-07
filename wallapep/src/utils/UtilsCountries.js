const countryNames = [
    "Alemania", "Andorra", "Argentina", "Australia", "Austria", "Bélgica", "Bolivia", "Brasil",
    "Bulgaria", "Canadá", "Chile", "China", "Colombia", "Corea del Sur", "Costa Rica", "Croacia",
    "Cuba", "Dinamarca", "Ecuador", "Egipto", "El Salvador", "Eslovaquia", "Eslovenia", "España",
    "Estados Unidos", "Estonia", "Filipinas", "Finlandia", "Francia", "Grecia", "Guatemala",
    "Honduras", "Hungría", "India", "Indonesia", "Irlanda", "Islandia", "Israel", "Italia", "Japón",
    "Letonia", "Lituania", "Luxemburgo", "Malta", "Marruecos", "México", "Mónaco", "Nicaragua",
    "Noruega", "Nueva Zelanda", "Países Bajos", "Panamá", "Paraguay", "Perú", "Polonia", "Portugal",
    "Puerto Rico", "Reino Unido", "República Checa", "República Dominicana", "Rumanía", "Rusia",
    "Senegal", "Serbia", "Sudáfrica", "Suecia", "Suiza", "Túnez", "Turquía", "Ucrania", "Uruguay",
    "Venezuela",
];

export const countries = countryNames.map(name => ({ value: name, label: name }));

let normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export let filterCountryOption = (input, option) => {
    return normalize(option.label).includes(normalize(input));
}
