import Ember from 'ember';

export default Ember.Service.extend({
    acceptedpage: 1,
    pendingpage: 1,
    rejectedpage: 1,
    page: 1,
    limit: 10,
    activeButton: 'pending',
    sort: 'date_created',
    setPage: function(pageNumber, type) {
        this.set(type + 'page', pageNumber);
        this.set('page', pageNumber);
    },
    setButton: function(type) {
        this.set('activeButton', type);
    },
    getButton: function() {
        return this.get('activeButton');
    },
    setAsc: function() {
        this.set('sort', 'date_created');
    },
    setDesc: function() {
        this.set('sort', '-date_created');
    }
});
