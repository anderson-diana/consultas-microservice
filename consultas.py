from datetime import datetime
from flask import jsonify, make_response, abort

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))
    
CONSULTAS = {
    "001": {
        "idpaciente": "1234",
        "idconsulta": "001",
        "nespec": "Clinico Geral",
        "dconsu": "03/12/2020",
        "hconsu": "17:00",
        "timestamp": get_timestamp(),
        
    },
      "002": {
        "idpaciente": "12",
        "idconsulta": "002",
        "nespec": "Clinico Geral",
        "dconsu": "03/12/2020",
        "hconsu": "17:00",
        "timestamp": get_timestamp(),
        
    },

}

def read_all():
    dict_consultas = [CONSULTAS[key] for key in sorted(CONSULTAS.keys())]
    consultas = jsonify(dict_consultas)
    qtd = len(dict_consultas)
    content_range = "Consultas 0-"+str(qtd)+"/"+str(qtd)
    # Configura headers
    consultas.headers['Access-Control-Allow-Origin'] = '*'
    consultas.headers['Access-Control-Expose-Headers'] = 'Content-Range'
    consultas.headers['Content-Range'] = content_range
    return consultas
    

def read_one(idconsulta):
    if idconsulta in CONSULTAS:
        consulta = CONSULTAS.get(idconsulta)
    else:
        abort(
            404, " Consulta não encontrada ({idpac})".format(idconsulta=idconsulta)
        )
    return consulta

def update(idconsulta, consulta):
    if idconsulta in CONSULTAS:
        CONSULTAS[idconsulta]["dconsu"] = consulta.get("dconsu")
        CONSULTAS[idconsulta]["hconsu"] = consulta.get("hconsu")
        CONSULTAS[idconsulta]["timestamp"] = get_timestamp()
        return CONSULTAS[idconsulta]
    else:
        abort(
            404, "A consulta com o identificador {idconsulta} nao foi encontrada".format(idconsulta=idconsulta)
        ) 
        
def delete(idconsulta):
    if idconsulta in CONSULTAS:
        del CONSULTAS[idconsulta]
 
 

def create(consulta):
    
    idpaciente = consulta.get("idpaciente")
    idconsulta = consulta.get("idconsulta")
    dconsu = consulta.get("dconsu")
    horaconsu = consulta.get("hconsu")
    nespec = consulta.get("nespec")
    timestamp = get_timestamp()
    
    if(idconsulta not in CONSULTAS):
        CONSULTAS[idconsulta] = {
            "idpaciente": idpaciente,
            "idconsulta": idconsulta,
            "nespec": nespec,
            "dconsu": dconsu,
            "hconsu": horaconsu,
            "timestamp": get_timestamp()
        }
        return make_response(
            "{idconsulta} criado com sucesso".format(idconsulta=idconsulta), 201
        )
    else:
        abort(
            406,
            "Paciente com o numero {idconsulta} ja existe".format(idconsulta=idconsulta),
        )
