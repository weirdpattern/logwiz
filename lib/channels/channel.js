/**
 * @module log.channel
 */

import Filter from '../filters/filter';
import Formatter from '../formats/formatter';
import BasicFormatter from '../formats/basic-formatter';
import WrapperFormatter from '../formats/wrapper-formatter';
import { extend, guard, ExtensionPoints } from '../common/utils';

/**
 * @public
 * @constructor
 * @memberof log.channel
 * @since 1.0.0
 *
 * Represents a channel inside the logger.
 *
 * @param {string} name - the name of the channel.
 * @param {log.format.Formatter} format - the layout to be used.
 * @param {Object} options - the options of the channel.
 * @throws {TypeError} when [name] is not a string.
 * @throws {TypeError} when [format] is not a valid instance of {@link log.format.Format} or a function.
 */
function Channel (name, format, options) {
  guard(TypeError, name != null && typeof name !== 'string' && name.trim().length === 0,
        'Argument "name" must be of type String');

  format = format || new BasicFormatter();
  if (typeof format === 'function' && !(format instanceof Formatter)) {
    format = new WrapperFormatter(format);
  }

  guard(TypeError, format instanceof Formatter, 'Argument "format" must be of type Format or a function');

  extend(this, {
    'name': name
  }, ExtensionPoints.ENUMERABLE);

  extend(this, {
    '_head': null,
    '_tail': null
  }, ExtensionPoints.WRITABLE);

  this.config(options);
}

extend(Channel.prototype, {
  /**
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Adds a new filter to the channel.
   *
   * @param {log.filters.Filter} filter - the filter to be added.
   * @throws {TypeError} when [filter] is not valid or not a {@link log.filters.Filter}.
   */
  addFilter (filter) {
    guard(TypeError, filter != null && filter instanceof Filter, 'Argument "filter" must be of type Filter');

    if (this._head == null) {
      this._head = this._tail = filter;
    } else {
      this._tail.next = filter;
      this._tail = filter;
    }
  },

  /**
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Clears all filters in the channel.
   */
  clearFilters () {
    this._head = this._tail = null;
  }
}, ExtensionPoints.ENUMERABLE);

extend(Channel.prototype, {
  /**
   * @abstract
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Configures the channel with the given options.
   *
   * @param {Object} options - the options to be loaded into the channel.
   */
  config (options) {},

  /**
   * @abstract
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Closes the channel, releasing all resources.
   */
  close () {},

  /**
   * @abstract
   * @public
   * @function
   * @memberof log.channel
   * @since 1.0.0
   *
   * Sends the logging event.
   *
   * @param {log.logger.LogEvent} event -  the event to be logged.
   */
  send (event) {}
}, ExtensionPoints.ENUMERABLE | ExtensionPoints.CONFIGURABLE);

export default Channel;