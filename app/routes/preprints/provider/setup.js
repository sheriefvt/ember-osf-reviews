import Ember from 'ember';
import resetscroll from '../../../mixins/reset-scroll';


export default Ember.Route.extend(resetscroll, {
    afterModel(model/*, transition */) {
        if (model.get('reviewsWorkflow')) return this.replaceWith('preprints.provider', model);
    },
    renderTemplate(controller, model) {
        // We're a special page.
        // Render into the applications outlet rather than the `provider` outlet.
        this.render(this.routeName, {
            controller: controller,
            into: 'application',
            model: model,
        });
    },
});
