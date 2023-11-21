import requests
from bs4 import BeautifulSoup
import json

url = "z"

response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')

    coches = soup.find_all('div', class_='infoContainer___1SJjz')

    datos_coches = []

    for coche in coches:
        nombre_coche = coche.find('h2', {'data-qa-selector': 'title'}).text
        precio = coche.find('div', {'data-qa-selector': 'price'}).text.strip()
        modelo = coche.find('h3', {'data-qa-selector': 'subtitle'}).text
        año = coche.find('li', {'data-qa-selector': 'spec-year'}).text.split("•")[1].strip()
        combustible = coche.find('li', {'data-qa-selector': 'spec-fuel'}).text.split("•")[1].strip()
        kilometros = coche.find('li', {'data-qa-selector': 'spec-mileage'}).text.split("•")[1].strip()

        coche_data = {
            "Nombre del coche": nombre_coche,
            "Precio": precio,
            "Modelo": modelo,
            "Año": año,
            "Tipo de combustible": combustible,
            "Kilómetros": kilometros,
            "Imágenes": ""
        }

        datos_coches.append(coche_data)

    # Guardar datos en un archivo JSON
    with open('coches2.json', 'w', encoding='utf-8') as json_file:
        json.dump(datos_coches, json_file, ensure_ascii=False, indent=4)

    # Generar la tabla HTML
    html_table = """
    <style>
    /* Estilos CSS personalizados para la tabla */
    .custom-table {
        background-color: #f8f9fa;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .custom-table thead th {
        background-color: #007bff;
        color: #ffffff;
    }
    
    .custom-table tbody tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    </style>

    <table class="table custom-table">
        <thead>
            <tr>
                <th>Nombre del coche</th>
                <th>Precio</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Tipo de combustible</th>
                <th>Kilómetros</th>
            </tr>
        </thead>
        <tbody>
    """

    for coche_data in datos_coches:
        html_table += """
            <tr>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
            </tr>
        """.format(coche_data["Nombre del coche"], coche_data["Precio"], coche_data["Modelo"],
                   coche_data["Año"], coche_data["Tipo de combustible"], coche_data["Kilómetros"])

    html_table += """
        </tbody>
    </table>
    """

    with open('coches_table.html', 'w', encoding='utf-8') as html_file:
        html_file.write(html_table)

    print("Los datos se han guardado en 'coches_table.html' y 'coches2.json' satisfactoriamente.")
else:
    print("No se pudo acceder a la página:", response.status_code)
