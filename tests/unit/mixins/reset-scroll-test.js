import Ember from 'ember';
import ResetScrollMixin from 'reviews/mixins/reset-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | reset scroll');

test('it works', function(assert) {
  let RouteObject = Ember.Route.extend(ResetScrollMixin);
  let TestedRoute = RouteObject.create();
  TestedRoute.set('scrollTarget', {
      scrollTo() {
          return [...arguments];
      }
  });
  assert.ok(TestedRoute);
  assert.ok(ResetScrollMixin.detect(TestedRoute));
  assert.deepEqual(TestedRoute.activate(), [0, 0]);
});
