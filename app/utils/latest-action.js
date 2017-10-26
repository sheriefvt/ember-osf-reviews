import moment from 'moment';


export default function latestAction(submissionActions) {
    if (!submissionActions.get('length')) {
        return null;
    }
    // on create, Ember puts the new object at the end of the array
    // https://stackoverflow.com/questions/15210249/ember-data-insert-new-item-at-beginning-of-array-instead-of-at-the-end
    const first = submissionActions.get('firstObject');
    const last = submissionActions.get('lastObject');
    return moment(first.get('dateModified')) > moment(last.get('dateModified')) ? first : last;
}
