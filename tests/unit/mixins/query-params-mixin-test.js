import Ember from 'ember';
import QueryParamsMixinMixin from 'reviews/mixins/query-params-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | query params mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let QueryParamsMixinObject = Ember.Object.extend(QueryParamsMixinMixin);
  let subject = QueryParamsMixinObject.create();
  assert.ok(subject);
});
