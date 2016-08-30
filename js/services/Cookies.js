//factoria que controla la autentificación, devuelve un objeto
//$cookies para crear cookies
//$cookieStore para actualizar o eliminar
//$location para cargar otras rutas
angular
.module('CookiesService',[])
.factory("auth", function($cookies,$cookieStore)
{
    return{
        login : function(username, password)
        {
            //creamos la cookie con el nombre que nos han pasado
            $cookies.username = username,
            $cookies.password = password;
            $cookieStore.put("username", username)
            $cookieStore.put("password", password)
            //mandamos a la home
        },
        logout : function()
        {
            //al hacer logout eliminamos la cookie con $cookieStore.remove
            $cookieStore.remove("username"),
            $cookieStore.remove("password");
            //mandamos al login
            //$location.path("/login");
        },
        // checkStatus : function()
        // {
        //     //creamos un array con las rutas que queremos controlar
        //     var rutasPrivadas = ["/home","/dashboard"];
        //     if(this.in_array($location.path(),rutasPrivadas) && typeof($cookies.username) == "undefined")
        //     {
        //         $location.path("/foods/#/login");
        //     }
        //     //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
        //     if(this.in_array("/foods/#/login",rutasPrivadas) && typeof($cookies.username) != "undefined")
        //     {
        //         $location.path("/foods/#/login");
        //     }
        // },
        // in_array : function(needle, haystack)
        // {
        //     var key = '';
        //     for(key in haystack)
        //     {
        //         if(haystack[key] == needle)
        //         {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
    }
});