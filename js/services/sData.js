angular
.module('ServeData',[])
.service('sData', [function () {
	return {
    foods: {},
    food: {},
    qty: 'test',
    user: {},
    url: "",
    messages: {},
    my_foods: {},
    my_alerts: {},
    sender: false,
    sender_id: "",
    loading: false,
    alerta: {},
    alert_data: {}, 
    pos: {},
  }
}])
