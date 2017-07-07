$(document).ready(function () {
    var selPipelineID = null;


    $('#pipelinelist').on('click', '.list-group-item', function () {

        selPipelineID = $(this).data('pipelineid');
        var pipelineName = $(this).html();
        $('#cypaneltitle').html(pipelineName);
        $('#cypanel').removeAttr("style");

        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                "id": selPipelineID,
                "p": "getNetwork"
            },
            async: false,
            success: function (s) {

                window.cy = cytoscape({
                    container: $('#cy'),
                    elements: generateNetwork(s),
                    style: [
                        {
                            selector: 'node[type = "parameter"]',
                            style: {
                                'background-image': 'css/parameter_image.png',
                                'shape': 'ellipse',
                                'width': '50',
                                'height': '50',
                                'label': 'data(displayname)'   //cytoscapete gosterilecek parameter ismi burada secilir.
                            }
                        },

                        {
                            selector: 'edge',
                            style: {
                                'width': 4,
                                'target-arrow-shape': 'triangle',
                                'line-color': '#9dbaea',
                                'target-arrow-color': '#9dbaea',
                                'curve-style': 'bezier'
                            }
                        },
                        {
                            selector: 'node[type = "process"]',
                            style: {
                                'background-image': 'css/process_image.png',
                                'shape': 'ellipse',
                                'width': '75',
                                'height': '75',
                                'label': 'data(displayname)'   

                            }
                        }
                    ],

                    layout: {
                        name: 'dagre',
                        rankDir: 'LR'
                    }
                });

                window.cy.cxtmenu({
                    selector: 'core',
                    commands: [
                        {
                            content: 'Add Process',
                            select: function () {
                                $('#pipelineprocessmodal').modal('show');
                            }
                        }
                    ]
                });

                window.cy.cxtmenu({
                    selector: 'node[type = "process"]',
                    commands: [
                        {
                            content: 'Remove Process',
                            select: function (ele) {
                                //(2)processler ppp_process_name-process_id seklinde tanimlandigi icin burada name ve id ayrilir.
                                var process_idnew = ele.id();
                                process_idnew = process_idnew.substring(0, process_idnew.length - 2);
                                var re = new RegExp('\w*-\d*', 'g');
                                var nameList = process_idnew.split(re);
                                var process_name = nameList[0];
                                var process_id = nameList[1];

                                $.ajax({
                                    type: "POST",
                                    url: "ajax/ajaxquery.php",
                                    data: {
                                        "process_id": process_id,
                                        "pipeline_id": selPipelineID,
                                        "name": process_name, //(2) esleme bilgisi name ile saklanir
                                        "p": "removePipelineProcess"
                                    },
                                    async: false,
                                    success: function () {


                                        $.ajax({
                                            type: "GET",
                                            url: "ajax/ajaxquery.php",
                                            data: {
                                                "id": selPipelineID,
                                                "p": "getNetwork"
                                            },
                                            async: false,
                                            success: function (result) {

                                                window.cy.remove(window.cy.elements());
                                                window.cy.add(generateNetwork(result));
                                                var layout = window.cy.layout({
                                                    name: 'dagre',
                                                    rankDir: 'LR'
                                                });
                                                layout.run();

                                            },
                                            error: function (errorThrown) {
                                                alert("Error: " + errorThrown);
                                            }
                                        });
                                    },
                                    error: function (p, c, a) {
                                        alert("Error: " + p + " " + c + " " + a);
                                    }
                                });
                            }
                        }
                    ]
                });

                window.cy.panzoom();
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });

    });

    $.ajax({
        type: "GET",
        url: "ajax/ajaxquery.php",
        data: { p: "getAllPipelines" },
        async: false,
        success: function (s) {
            var pipelineList = $('#pipelinelist');
            for (var i = 0; i < s.length; i++) {
                pipelineList.prepend('<button type="button" class="list-group-item" data-pipelineid=' + s[i].id + '>' + s[i].name + '</button>');
            }

            $('#pipelinelist button:first').click();
        },
        error: function (errorThrown) {
            alert("Error: " + errorThrown);
        }
    });

    function generateNetwork(s) {


        var elements = [];
        var processMap = {};
        var parameterMap = {};

        for (var i in s) {
            var item = s[i];
            //(2) processlerin birbirnden ayrilmasi icin item.ppp_process_name eklendi.
            if (!(item.ppp_process_name + "-" + item.process_id in processMap)) {
                processMap[item.ppp_process_name + "-" + item.process_id] = item;//(2)
                elements.push({ data: { id: item.ppp_process_name + "-" + item.process_id + '_1', type: 'process', name: item.process_name, displayname: item.ppp_process_name + "_" + item.process_name } });

            }  //(1) process name'i {defined name}_{process_name} şeklinde gosterecek displayname eklendi.

            if (!(item.ppp_name + "-" + item.parameter_id in parameterMap)) {
                parameterMap[item.ppp_name + "-" + item.parameter_id] = item.parameter_name;//(2)parameterlarin matching bilgisi  ppp_name ile verilir.
                elements.push({ data: { id: item.ppp_name + "-" + item.parameter_id + '_0', type: 'parameter', name: item.parameter_name, displayname: item.ppp_name + "_" + item.parameter_name } });
            }
        }

        for (var i = 0; i < elements.length; i++) {
        }

        for (var i = 0; i < s.length; i++) {
            var item = s[i];
            var edgeObj = { data: {} };
            if (item.type === 'input') {
                edgeObj.data.source = item.ppp_name + "-" + item.parameter_id + '_0'; //(2)parameterlarin matching bilgisi icin ppp_name kullanilir.
                edgeObj.data.target = item.ppp_process_name + "-" + item.process_id + '_1'; //2 processlerin birbirnden ayrilmasi icin item.ppp_process_name kullanilir.
            } else {
                edgeObj.data.source = item.ppp_process_name + "-" + item.process_id + '_1'; //(2)
                edgeObj.data.target = item.ppp_name + "-" + item.parameter_id + '_0'; //(2)
            }

            elements.push(edgeObj);
        }

        for (var i = 0; i < elements.length; i++) {
        }
        return elements;
    }

    //secilen process seceneklerinin input parametreleri ile ayni file_type sahip nodlarin siralandigi fonksiyon.
    function getOption() {
        var process_id = $("#mppProcess option:selected").val(); //(2)secilen option'larin degerini alir

        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                "process_id": process_id,
                "p": "getAllProcessParametersDetail"
            },
            async: false,
            success: function (sprocess) {  //(2) sprocess ile input process parameterleri listesi oluşturur


                $.ajax({
                    type: "GET",
                    url: "ajax/ajaxquery.php",
                    data: {
                        "id": selPipelineID,
                        "p": "createNextflow"
                    },
                    async: false,
                    success: function (spipe) {  //(2) spipe ile pipelinedaki eklenmis parameterlerin listesi, output match için bilgiler gelir
                        $("#dynamic_field").empty();

                        for (var k = 0; k < sprocess.length; k++) {
                            if (sprocess[k].type === 'input') {   //sprocess ile modalda secilen processinin input parametreleri listelenir 

                                $("#dynamic_field").append('<tr id=row' + k + '><td style="width:30%" id=input' + k + '>' + sprocess[k].channel_name + '</td><td   ><select  style="width:218px" id=output' + k + '></select></td><td style="width:30%"><input type="text"  id=matchname' + k + '></input></td></tr>');
                                var n = 0;
                                optionMap = {};
                                for (var i = 0; i < spipe.length; i++) {

                                    if (sprocess[k].file_type === spipe[i].file_type) {  //spipe ile pipeline'a eklenmis nodelarin file type'i kontrol edilir
                                        n++;
                                        var output = spipe[i];
                                        option_name = output.ppp_name + '_' + output.parameter_channel_name + '  V:' + output.version + ' (' + output.process_parameter_type + ')';

                                        if (!(option_name in optionMap)) {
                                            optionMap[option_name] = option_name; //(2)tekrarlari engellemek icin optionMap kullanilir.
                                            option_value = output.ppp_id;
                                            var option = new Option(option_name, option_value);  //(2)option value ile secilen pipeline_process_parameter_id (ppp_id) degeri burada verilir.
                                            $(option).html(option_name);
                                            $("#matchname" + k).attr('name', output.parameter_id);   //(2)input name kismi spipe[i].parameter_id olarak verilir
                                            $("#matchname" + k).attr('placeholder', 'Enter Name');
                                            $("#output" + k).attr('name', 'ppp_id');   //(2)option  name kismi spipe[i].ppp_process_name olarak verilir
                                            if (n === 1) {
                                                $('#output' + k).prepend("<option value='' selected='selected'>Select</option>");
                                                $('#output' + k).append(option);
                                            }
                                            else {
                                                $('#output' + k).append(option);
                                            };
                                        }
                                    }
                                    option = null;
                                }


                            }
                        }
                    }
                });


            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    }

    $('#pipelineprocessmodal').on('show.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $("#dynamic_field").empty();  //process ekleme modalindaki dynamic_field'i sifirlar
        $('#pipelineprocessmodaltitle').html('Add New Process to Pipeline');
        $('#mppPipeline').val(selPipelineID);

        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: { p: "getAllProcesses" },
            async: false,
            success: function (s) {
                $("#mppProcess").empty();
                for (var i = 0; i < s.length; i++) {
                    var process = s[i];
                    var option = new Option(process.name, process.id);
                    $(option).html(process.name);
                    $("#mppProcess").append(option);

                }
                //secilen process option'larina bagli olarak input parameter ve ayni file_type sahip nodlarin siralandigi getOption fonksiyonu cagrilir.
                getOption();
                mppProcess.onchange = getOption;  

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

	
    
    $('#pipelineprocessmodal').on('click', '#savepipelineprocess', function (event) {
        event.preventDefault();
        var formValues = $('#pipelineprocessmodal').find('input, select');
        var data = formValues.serializeArray(); // convert form to array

        data.push({ name: "p", value: "savePipelineProcessParameterDefault" });
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            success: function (s) {


                /////////PipelineProcessParameter tablosu matching datasina göre update edilir/////////

                $('#dynamic_field').find('tr').each(function () {  // 'input'+k seklinde girilen satir id'leri inputrow'da listelenir.

                    var formmatch = $($(this)).find('input, select');
                    var matchdata = formmatch.serializeArray(); //option secildikten sonra gelen data matchdata icinde saklanir.
                    if (matchdata.length !== 0) {
                        if (matchdata[0].value !== "" && matchdata[1].value !== "") {  //option secilmemisse veya isim girilmemisse
							
                            var ppp_id = matchdata[0].value;  //secilen pipeline_process_parameter_id (ppp_id) degeri
                            var parameter_id = matchdata[1].name;
                            var ppp_name = matchdata[1].value;   //option kısmında yazılan yazı
                            var matcharray = {};
                            matchdatainput = [{ "name": "name", "value": ppp_name }, //channel name icin bilgi burada name olarak saklanir.
                            { "name": "type", "value": 'input' },
                            { "name": "parameter_id", "value": parameter_id },
                            { "name": "process_name", "value": data[1].value },  //data[1].value ile process_name cekilir.
                            data[2]];   // pipeline id ile  cekilir.  

                            matchdataoutput = [{ "name": "name", "value": ppp_name }, //channel name icin bilgi burada name olarak saklanir.
                            { "name": "id", "value": ppp_id }];   //secilen pipeline_process_parameter_id (ppp_id) degeri


                            matchid = [];
                            var t = 0;
                            var matcharray = { matchdatainput, matchdataoutput };  //match id pairleri olusturmak uzere 

                            Object.keys(matcharray).forEach(function (key) {
                                t++;
                                matcharray[key].push({ name: "p", value: "updatePipelineProcessParameter" });
                                $.ajax({
                                    type: "POST",
                                    url: "ajax/ajaxquery.php",
                                    data: matcharray[key],
                                    async: false,
                                    success: function (s) {

                                        matchid.push({ name: "id" + t, value: s[0].id });   //matchid  icine match edilen pairler (id1 ve id2 seklinde) yazilir
										
                                        upmatchid = [{ name: "ppp_id", value: s[0].id },
                                        { name: "name", value: matcharray[key][0].value },
                                        { name: "p", value: "updatebymatchid" }];  // updatebymatchid ile matchid icindeki matchler kontrol edilir ve ppp update edilir.

                                        $.ajax({
                                            type: "POST",
                                            url: "ajax/ajaxquery.php",
                                            data: upmatchid,
                                            async: false,
                                            success: function () {
                                            },
                                            error: function (errorThrown) {
                                                alert("Error: " + errorThrown);
                                            }
                                        })

                                    },
                                    error: function (errorThrown) {
                                        alert("Error: " + errorThrown);
                                    }
                                })

                            });

                            matchid.push({ name: "p", value: "insertmatchid" });  //match id pairleri matchid tablosuna yazilir.

                            $.ajax({
                                type: "POST",
                                url: "ajax/ajaxquery.php",
                                data: matchid,
                                async: false,
                                success: function () {
                                },
                                error: function (errorThrown) {
                                    alert("Error: " + errorThrown);
                                }
                            })
                        }
                    }
                })
                ///////////////////////////////////////////////////////////////


                $.ajax({
                    type: "GET",
                    url: "ajax/ajaxquery.php",
                    data: {
                        "id": selPipelineID,
                        "p": "getNetwork"
                    },
                    async: false,
                    success: function (result) {
                        window.cy.remove(window.cy.elements());
                        window.cy.add(generateNetwork(result));
                        var layout = window.cy.layout({
                            name: 'dagre',
                            rankDir: 'LR'
                        });
                        layout.run();

                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });
                $('#pipelineprocessmodal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });

    });


    $('#pipelinemodal').on('show.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $('#pipelinemodaltitle').html('Add New Pipeline');

    });


    $('#pipelinemodal').on('click', '#savepipeline', function (event) {
        event.preventDefault();
        var formValues = $('#pipelinemodal').find('input');
        var pipelineList = $('#pipelinelist');
        var data = formValues.serializeArray(); // convert form to array
        data.push({ name: "p", value: "savePipeline" });

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            success: function (s) {
                var addEl = null;
                for (var i = 0; i < formValues.length; i++) {
                    if ($(formValues[i]).attr('id') === 'mName') {
                        addEl = $('<button type="button" class="list-group-item" data-pipelineid=' + s.id + '>' + $(formValues[i]).val() + '</button>');
                        pipelineList.prepend(addEl);
                    }
                }
                $('#pipelinemodal').modal('hide');
                addEl.click();

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    $('#cypanel').on('click', '#removepipeline', function (e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                "id": selPipelineID,
                "p": "removePipeline"
            },
            async: false,
            success: function () {
                $('#pipelinelist button').each(function (i, button) {
                    if ($(button).data('pipelineid') === selPipelineID) {
                        $(button).remove();
                    }
                });
                $("#cypanel").css("display", "none");
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    $('#cypanel').on('click', '#createnextflow', function (e) {
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                "id": selPipelineID,
                "p": "createNextflow"
            },
            async: false,
            success: function (s) {
                var content = [];
                var processMap = {};
                var channelMap = {};

                content.push("#!/usr/bin/env nextflow");

                /// process ile ilgili kisimlarda process_id yerine ppp_process_name kullanilir
                /// parameter  ile ilgili kisimlarda esleme biligisi icin ppp_name kullanilir.
                for (var i = 0; i < s.length; i++) {
                    item = s[i];
                    if (!(item.ppp_process_name in processMap)) {
                        processMap[item.ppp_process_name + "_" + item.process_id] = {
                            'ppp_process_name': item.ppp_process_name + "_" + item.process_name,   //(1)
                            'process_script': item.process_script
                        };
                    }

                    if (item.ppp_name === '') {   //(4)option seçilmemisse ilk basa parameter olarak yazdirir.
                        channelName = item.ppp_process_name + "_" + item.parameter_channel_name;
                    }
                    else {
                        var channelName = item.ppp_name + "_" + item.parameter_channel_name;
                    }
                    if (!(channelName in channelMap)) {
                        channelMap[channelName] = channelName;

                        if (item.process_parameter_type === 'input') {
                            if (item.parameter_file_path.length !== 0) {

                                if (item.parameter_file_path.indexOf('{1,2}') !== -1) {
                                    content.push("Channel.fromFilePairs(" + item.parameter_file_path + ").set(" + channelName + ")");
                                } else {
                                    content.push(channelName + " = file(" + item.parameter_file_path + ")");
                                }

                            } else if (item.parameter_input_text.length !== 0) {
                                content.push("Channel.from(" + item.parameter_input_text + ")");
                            }
                        }
                    }


                }
                for (var pro in processMap) {
                    var p = processMap[pro];
                    content.push("process " + p.ppp_process_name + " { ");
                    var inputContent = [];
                    var outputContent = [];
                    inputContent.push("input:");
                    outputContent.push("output:");
                    for (var i = 0; i < s.length; i++) {
                        item = s[i];

                        if (item.ppp_name !== '') {   // option secilmisse, ppp_process_name ile process adi tanimlanir.  parametreler ppp_name ile eslestirilir. 


                            if (p.ppp_process_name === item.ppp_process_name + "_" + item.process_name) {  //(1) ppp_process_name kullanilir
                                if (item.process_parameter_type === 'input') {
                                    if (item.parameter_qualifier === 'set') {  //(2) 
                                        inputContent.push(item.parameter_qualifier + " pair_id, " + item.process_parameter_name + " from " + item.ppp_name + "_" + item.parameter_channel_name);
                                    } else {
                                        inputContent.push(item.parameter_qualifier + " " + item.process_parameter_name + " from " + item.ppp_name + "_" + item.parameter_channel_name);
                                    }
                                }

                                else if (item.process_parameter_type === 'output') {
                                    if (item.parameter_qualifier === 'set') {
                                        outputContent.push(item.parameter_qualifier + " pair_id, " + item.process_parameter_name + " into " + item.ppp_name + "_" + item.parameter_channel_name);
                                    } else {
                                        outputContent.push(item.parameter_qualifier + " " + item.process_parameter_name + " into " + item.ppp_name + "_" + item.parameter_channel_name);
                                    }


                                }
                            }
                        }
                        else { //option secilmemisse ilk basa parameter ppp_process_name kullanilarak yazdirir.


                            if (p.ppp_process_name === item.ppp_process_name + "_" + item.process_name) {  //(1)
                                if (item.process_parameter_type === 'input') {
                                    if (item.parameter_qualifier === 'set') {
                                        inputContent.push(item.parameter_qualifier + " pair_id, " + item.process_parameter_name + " from " + item.ppp_process_name + "_" + item.parameter_channel_name);
                                    } else {
                                        inputContent.push(item.parameter_qualifier + " " + item.process_parameter_name + " from " + item.ppp_process_name + "_" + item.parameter_channel_name);
                                    }
                                }

                                else if (item.process_parameter_type === 'output') {
                                    if (item.parameter_qualifier === 'set') {
                                        outputContent.push(item.parameter_qualifier + " pair_id, " + item.process_parameter_name + " into " + item.ppp_process_name + "_" + item.parameter_channel_name);
                                    } else {
                                        outputContent.push(item.parameter_qualifier + " " + item.process_parameter_name + " into " + item.ppp_process_name + "_" + item.parameter_channel_name);
                                    }
                                }
                            }
                        }
                    }
                    content.push.apply(content, inputContent);
                    content.push.apply(content, outputContent);
                    content.push(p.process_script);
                    content.push("}");
                }

                var nextflow = content.join("\r\n");
                var file = new File([nextflow], "Nextflow_generated.txt", { type: "text/plain;charset=utf-8" });
                saveAs(file);

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });
});
