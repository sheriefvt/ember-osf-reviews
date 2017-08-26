import Ember from 'ember';

export default Ember.Service.extend({
    acceptedpage: 1,
    pendingpage: 1,
    rejectedpage: 1,
    page: 1,
    limit: 10,
    activeButton: 'pending',
    sortType: 'date_created',
    filter: {},
    embed: 'node',
});
