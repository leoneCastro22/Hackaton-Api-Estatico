angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PessoaIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;
    vm.aux = false;

    vm.pessoa = {
        id: null,
        nome: "",
        email: "",
        dataNascimento: null,
        enderecos: [],
        perfils: [],
        situacao: false,
        fotoPerfil: null
    };
    vm.enderecoDefault = {
        id: null,
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };

    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";
    vm.urlCep = "http://localhost:8080/treinamento/api/enderecos/buscar/" ; 
  
    vm.Cep = function(){

        HackatonStefaniniService.listar(vm.urlCep + vm.enderecoDefault.cep).then(
            function (response){
                        
                if (vm.enderecoDefault.cep != "") {
                    if (response.data.erro === true) {
                        //cep é inválido.
                        alert("CEP inválido.");
                        vm.limparModal();
                    } //end if.
                    else if (response.data){
                        //Atualiza os campos com os dados
                        vm.enderecoDefault.uf = response.data.uf;
                        vm.enderecoDefault.localidade = response.data.localidade;
                        vm.enderecoDefault.bairro = response.data.bairro;
                        vm.enderecoDefault.logradouro = response.data.logradouro;
                        } //end if.  
                }                  
            })
        }

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Pessoa";
        vm.acao = "Cadastrar";
        /**Recuperar a lista de perfil */
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPessoa) {
                        vm.tituloTela = "Editar Pessoa";
                        vm.acao = "Editar";

                        vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
                            function (pessoaRetorno) {
                                if (pessoaRetorno !== undefined) {
                                    vm.pessoa = pessoaRetorno;
                                    vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
                                    
                                    vm.perfil = vm.pessoa.perfils[0];
                                }
                            }
                        );
                    }
                }
            }
        );
    }; 

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPessoas");
    };

    vm.abrirModal = function (endereco) {

        vm.enderecoModal = vm.enderecoDefault;
        if (endereco !== undefined)
            vm.enderecoModal = endereco;

        if (vm.pessoa.enderecos.length === 0)
            vm.pessoa.enderecos.push(vm.enderecoModal);

        $("#modalEndereco").modal();
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
        vm.endereco = undefined;
    };

    vm.limparModal = function (){
        vm.enderecoDefault.uf = "";
        vm.enderecoDefault.localidade = "";
        vm.enderecoDefault.bairro = "";
        vm.enderecoDefault.logradouro = "";
    }

    vm.incluir = function () {
        vm.pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);
        vm.pessoa.perfils.push(vm.perfil);
        
        
        if(vm.aux == true){
            vm.pessoa.fotoPerfil = document.getElementById("fotoPerfil").getAttribute("src");
        }

        var objetoDados = angular.copy(vm.pessoa);
        var listaEndereco = [];
        objetoDados.perfils = vm.pessoa.perfils;
        angular.forEach(objetoDados.enderecos, function (value, key) {
            if (value.complemento.length > 0) {
                value.idPessoa = objetoDados.id;
                listaEndereco.push(angular.copy(value));
            }
        });

        objetoDados.enderecos = listaEndereco;
        if (vm.perfil !== null){

            vm.isNovoPerfil = true;
            
            angular.forEach(objetoDados.perfils, function (value, key) {
                if (value.id === vm.perfil.id) {
                    vm.isNovoPerfil = false;
                }
            });
            if (vm.isNovoPerfil)
                objetoDados.perfils.push(vm.pessoa.perfils);
        }
        if (vm.acao == "Cadastrar") {

            vm.salvar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    alert("Perfil Cadastrado com sucesso!")
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            vm.alterar(vm.urlPessoa, objetoDados).then(
                
                function (pessoaRetorno) {
                    alert("Perfil Alterado com sucesso!")
                    vm.retornarTelaListagem();
                });
        }
        document.getElementById("fotoPerfil").src = '';
    };

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPessoa + objeto.id;
        if (tipo === "ENDERECO")
            url = vm.urlEndereco + objeto.id;

        vm.excluir(url).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            });
    };

    /**METODOS DE SERVICO */
    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
                else
                    deferred.resolve(vm.enderecoDefault);
            }
        );
        return deferred.promise;
    };

    vm.listar = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.salvar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.alterar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.excluir = function (url, objeto) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.carregaFoto = function () {

        var preview = document.querySelectorAll('img').item(0);
        var file = document.querySelector('input[type=file').files[0];
        var reader = new FileReader();

        reader.onloadend = function () {
            preview.src = reader.result;
        };

        if (file) {
            vm.aux = true;
            reader.readAsDataURL(file);
            console.log(file);
        } else {
            preview.src = "";
        }
    }

    /**METODOS AUXILIARES */
    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);//8,4 - 0,2
        var mes = data.slice(2, 4);//4,2 - 2,4
        var ano = data.slice(4, 8);//2,0 - 4,8

        return ano + "-" + mes + "-" + dia;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        return dia + mes + ano;
    };

    vm.listaUF = [
        { "id": "RO", "desc": "RO" },
        { "id": "AC", "desc": "AC" },
        { "id": "AM", "desc": "AM" },
        { "id": "RR", "desc": "RR" },
        { "id": "PA", "desc": "PA" },
        { "id": "AP", "desc": "AP" },
        { "id": "TO", "desc": "TO" },
        { "id": "MA", "desc": "MA" },
        { "id": "PI", "desc": "PI" },
        { "id": "CE", "desc": "CE" },
        { "id": "RN", "desc": "RN" },
        { "id": "PB", "desc": "PB" },
        { "id": "PE", "desc": "PE" },
        { "id": "AL", "desc": "AL" },
        { "id": "SE", "desc": "SE" },
        { "id": "BA", "desc": "BA" },
        { "id": "MG", "desc": "MG" },
        { "id": "ES", "desc": "ES" },
        { "id": "RJ", "desc": "RJ" },
        { "id": "SP", "desc": "SP" },
        { "id": "PR", "desc": "PR" },
        { "id": "SC", "desc": "SC" },
        { "id": "RS", "desc": "RS" },
        { "id": "MS", "desc": "MS" },
        { "id": "MT", "desc": "MT" },
        { "id": "GO", "desc": "GO" },
        { "id": "DF", "desc": "DF" }
    ];

}
