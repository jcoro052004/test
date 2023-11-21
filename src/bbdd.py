import pymongo
import json

# Conecta a la base de datos MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["coches"]
collection = db["co"]

# Lee los datos desde coches2.json
with open('coches2.json', 'r', encoding='utf-8') as json_file:
    datos_coches = json.load(json_file)

# Inserta los datos en la colección de MongoDB
result = collection.insert_many(datos_coches)

# Actualiza los documentos en la colección para agregar el campo "Imágenes" vacío
for doc in collection.find({"Imágenes": {"$exists": False}}):
    collection.update_one({"_id": doc["_id"]}, {"$set": {"Imágenes": ""}})

print(f"{len(result.inserted_ids)} documentos insertados en MongoDB.")

client.close()
