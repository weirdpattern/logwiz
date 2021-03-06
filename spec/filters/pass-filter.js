/**
 * @author Patricio Trevino
 */

import Filter, { FilterResults } from '../../lib/filters/filter';

export default function (test, PassFilter) {
  const passFilter = new PassFilter();

  test('filter pass-filter', (assert) => {
    assert.ok(passFilter instanceof Filter, 'pass-filter is a filter');
    assert.equals(passFilter.filter, void 0, 'filter must be undefined');
    assert.equals(passFilter.test(), FilterResults.PASS, 'filter must return PASS');
  });
}
