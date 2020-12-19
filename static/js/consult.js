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
        create: function(convenio,dnasc,fname,idpaciente,lname,ncart) {
            let ajax_options = {
                type: 'POST',
                url: 'api/pacientes',
                accepts: 'application/json',
                contentType: 'application/json',
                data: JSON.stringify(
                {
                    'convenio': convenio,
                    'dnasc': dnasc,
                    'fname': fname,
                    'idpaciente': idpaciente,
                    'lname': lname,
                    'ncart': ncart
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
        'delete': function(idpaciente) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/pacientes/' + idpaciente,
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
        $fname = $('#fname'),
        $lname = $('#lname'),
        $dnasc = $('#dnasc'),
        $conveio = $('#conveio'),
        $ncart = $("#ncart");

    // return the API
    return {
        reset: function() {
            $lname.val('');
            $fname.val('').focus();
        },
        update_editor: function(fname, lname) {
            $lname.val(lname);
            $fname.val(fname).focus();
        },
        build_table: function(consultas) {
            let rows = ''

            // clear the table
            $('.conteudo table > tbody').empty();

            // did we get a people array?
            if (consultas) {
                for (let i=0, l=consultas.length; i < l; i++) {
                    rows += `<tr><td class="fname">${consultas[i].dconsu}</td><td class="lname">${consultas[i].hconsu}</td><td>${consultas[i].nespec}</td>sss</tr>`;
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
        $fname = $('#fname'),
        $lname = $('#lname'),
        $dnasc = $('#dnasc'),
        $conveio = $('#conveio'),
        $ncart = $("#ncart");
        

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(fname, lname, idpaciente) {
        return fname !== "" && lname !== "" && idpaciente !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let idpaciente = $idpaciente.val(),
            fname = $fname.val(),
            lname = $lname.val(),
            dnasc = $dnasc.val(),
            convenio = $conveio.val(),
            ncart = $ncart.val();
            
        e.preventDefault();

        if (validate(fname, lname, idpaciente)) {
            model.create(convenio,dnasc,fname,idpaciente,lname,ncart)
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
        let lname = $lname.val();

        e.preventDefault();

        if (validate('placeholder', lname)) {
            model.delete(lname)
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
            fname,
            lname;

        fname = $target
            .parent()
            .find('td.fname')
            .text();

        lname = $target
            .parent()
            .find('td.lname')
            .text();

        view.update_editor(fname, lname);
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