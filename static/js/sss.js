// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';
    
    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/consultas',
                accepts: 'application/json',
                dataType: 'json'    
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function( dconsu, hconsu,idconsulta,idpaciente, nespec ) {
            let ajax_options = {
                type: 'POST',
                url: 'api/consultas',
                accepts: 'application/json',
                contentType: 'application/json',
                data: JSON.stringify(
                {
                      "dconsu": dconsu,
                      "hconsu": hconsu,
                      "idconsulta": idconsulta,
                      "idpaciente": idpaciente,
                      "nespec": nespec
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(fname, lname) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/clientes/' + lname,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'fname': fname,
                    'lname': lname
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(idconsu) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/consultas/' + idconsu,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $idpaciente = $('#idpaciente'),
        $idconsulta = $('#idconsulta'),
        $dconsulta =  $('#dconsu'),
        $hconsulta =  $('#hconsu'),
        $nespec    =  $('#nespec');
        

    // return the API
    return {
        reset: function() {
            $lname.val('');
            $fname.val('').focus();
        },
        update_editor: function(idconsulta, idpaciente, dataconsulta, horaconsulta, nespec) {
            $idpaciente.val(idpaciente);
            $idconsulta.val(idconsulta);
            $dconsulta.val(dataconsulta);
            $hconsulta.val(horaconsulta);
            $nespec.val(nespec);
        },
        build_table: function(consultas) {
            let rows = ''

            // clear the table
            $('.conteudo table > tbody').empty();

            // did we get a people array?
            if (consultas) {
                for (let i=0, l=consultas.length; i < l; i++) {
                    rows += `<tr><td class="idpaciente">${consultas[i].idpaciente}</td><td class="idconsulta">${consultas[i].idconsulta}</td><td class="dataconsulta">${consultas[i].dconsu}</td><td class="horaconsulta">${consultas[i].hconsu}</td><td class="nespecialista">${consultas[i].nespec}</td><td class="acoes"><button id="delete" class="btn btn-danger">Deletar</button></td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $idpaciente = $('#idpaciente'),
        $idconsulta = $('#idconsulta'),
        $dconsulta = $('#dconsu'),
        $hconsulta = $('#hconsu'),
        $nespec = $('#nespec');
        
        
    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(idconsulta, idpaciente) {
        return idconsulta !== ""  && idpaciente !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let idpaciente = $idpaciente.val(),
            idconsulta = $idconsulta.val(),
            dconsu = $dconsulta.val(),
            hconsu = $hconsulta.val(),
            nespec = $nespec.val();
            
        e.preventDefault();

        if (validate(idconsulta, idpaciente)) {
            model.create(dconsu,hconsu,idconsulta,idpaciente, nespec) 
        } else {
            alert('Problema com os parâmetros: primeiro ou último nome');
        }
    });

    $('#update').click(function(e) {
        let fname = $fname.val(),
            lname = $lname.val();

        e.preventDefault();

        if (validate(fname, lname)) {
            model.update(fname, lname)
        } else {
            alert('Problema com os parâmetros: primeiro ou último nome');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
       
       let $target = $(e.target),
         idconsu ;

      idconsu = $target
            .parent()
            .find('td.idconsulta')
            .text();
        e.preventDefault();

        if (validate('placeholder', idconsu)) {
            model.delete(idconsu)
        } else {
            alert('Problema com os parâmetros: primeiro ou último nome');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        //location.reload();
        //model.read();
        window.location.reload();
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            idpaciente,
            idconsulta,
            dataconsulta,
            horaconsulta,
            nespec ;

        idpaciente = $target
            .parent()
            .find('td.idpaciente')
            .text();
            
        idconsulta = $target
            .parent()
            .find('td.idconsulta')
            .text();
            
        horaconsulta = $target
            .parent()
            .find('td.horaconsulta')
            .text();

        dataconsulta = $target
            .parent()
            .find('td.dataconsulta')
            .text();
            
         nespec = $target
            .parent()
            .find('td.nespecialista')
            .text();
            
        view.update_editor(idconsulta, idpaciente, dataconsulta, horaconsulta, nespec);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = "Msg de Erro:" + textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));