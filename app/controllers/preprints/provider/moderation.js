import Ember from 'ember';
import queryParamsMixin from '../../../mixins/query-params-mixin'

export default Ember.Controller.extend(queryParamsMixin, {
    theme: Ember.inject.service(),
    store: Ember.inject.service(),
});
