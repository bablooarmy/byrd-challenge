export const environment = {
  production: true,
  customerAPI:{
    list: 'http://polls.apiblueprint.org/customers'
  },
  orderAPI:{
    ordersByDateRange: 'http://polls.apiblueprint.org/orders/{0}?start_date={1}&end_date={2}'
  }
};
