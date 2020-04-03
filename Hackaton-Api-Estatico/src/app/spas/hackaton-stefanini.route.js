(function(angular){
    "use strict";

    angular.module('hackaton-stefanini').config(function ($routeProvider) {
        $routeProvider

            /** Rota para Home */
            .when('/', {
                templateUrl: 'app/spas/homePage/template/home.tpl.html',
                controller: 'HomeController as vm'
            })
            /** Rotas para Pessoas */
            .when('/listarPessoas', {
                templateUrl: 'app/spas/pessoas/template/pessoa-listar.tpl.html',
                controller: 'PessoaListarController as vm'
            })
            .when('/EditarPessoas/:idPessoa', {
                templateUrl: 'app/spas/pessoas/template/pessoa-incluir-alterar.tpl.html',
                controller: 'PessoaIncluirAlterarController as vm'
            })
            .when('/cadastrarPessoa', {
                templateUrl: 'app/spas/pessoas/template/pessoa-incluir-alterar.tpl.html',
                controller: 'PessoaIncluirAlterarController as vm'
            })

            /** Rotas para Perfils */
            .when('/listarPerfis', {
                templateUrl: 'app/spas/perfil/template/perfil-listar.tpl.html',
                controller: 'PerfilsListarController as vm'
            })
            .when('/EditarPerfis/:idPerfis', {
                templateUrl: 'app/spas/perfil/template/perfil-incluir-alterar.tpl.html',
                controller: 'PerfilsIncluirAlterarController as vm'
            })
            .when('/cadastrarPerfis', {
                templateUrl: 'app/spas/perfil/template/perfil-incluir-alterar.tpl.html',
                controller: 'PerfilsIncluirAlterarController as vm'
            })

            /** Rota para Endereço */

            .when('/cadastrarEndereco', {
                templateUrl: 'app/spas/endereco/template/endereco-incluir-alterar.tpl.html',
                controller: 'EnderecoIncluirAlterarController as vm'
            })
            .when('/EditarEndereco/:idEndereco', {
                templateUrl: 'app/spas/endereco/template/endereco-incluir-alterar.tpl.html',
                controller: 'EnderecoIncluirAlterarController as vm'
            })
            
            .otherwise({
                templateUrl: 'index_ERROR.html'
            });
    });

}(angular));

