import React from 'react'
import { shallow, mount } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import Counter from '../src/'
import CounterSegment from '../src/CounterSegment'

beforeAll(function () {
  console.error = jest.fn(() => null) // disable React PropTypes warnings
})

describe('initialization', function () {
  it('throws an error when no time options are provided', function () {
    expect(
      () => shallow(<Counter />)
    ).toThrowError('provide either "seconds" or "to" and "from"')
  })

  it('throws an error when "to", "from" and "seconds" are provided', function () {
    expect(
      () => shallow(<Counter from={0} to={1} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
  })

  it('throws an error when time options are provided incorrectly', function () {
    expect(
      () => shallow(<Counter from={0} />)
    ).toThrowError('provide either "seconds" or "to" and "from"')
    expect(
      () => shallow(<Counter to={0} />)
    ).toThrowError('provide either "seconds" or "to" and "from"')
    expect(
      () => shallow(<Counter from={0} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
    expect(
      () => shallow(<Counter to={0} seconds={2} />)
    ).toThrowError('cannot use "to" and "from" with "seconds"')
    expect(
      () => shallow(<Counter from={1} to={0} />)
    ).toThrowError('"to" must be bigger than "from"')
    expect(
      () => shallow(<Counter seconds={-1} />)
    ).toThrowError('"seconds" must be greater than or equal to zero')
    expect(
      () => shallow(<Counter seconds={0} minDigits={0} />)
    ).toThrowError('"minDigits" must be positive')
    expect(
      () => shallow(<Counter seconds={0} minPeriod='sobaka' />)
    ).toThrowError('"minPeriod" must be one of: day, hour, minute, second')
    expect(
      () => shallow(<Counter seconds={0} maxPeriod='sobaka' />)
    ).toThrowError('"maxPeriod" must be one of: day, hour, minute, second')
    expect(
      () => shallow(<Counter seconds={0} syncTime />)
    ).toThrowError('"syncTime" must only be used with "to" and "from"')
    expect(
      () => shallow(<Counter seconds={0} radix={37} />)
    ).toThrowError('"radix" must be between 2 and 36')
    expect(
      () => shallow(<Counter seconds={0} digitWrapper={48} />)
    ).toThrowError('"digitWrapper" must be a function')
    expect(
      () => shallow(<Counter seconds={0} digitMap='111' />)
    ).toThrowError('"digitMap" must be an object')
  })

  it('initializes when options are correct', function () {
    expect(
      () => shallow(<Counter from={0} to={1} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} minDigits={1} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} maxDigits={3} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} minPeriod='minute' />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={2} maxPeriod='hour' />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter from={0} to={1} syncTime />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={0} radix={12} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={0} digitWrapper={() => null} />)
    ).not.toThrow()
    expect(
      () => shallow(<Counter seconds={0} digitMap={{}} />)
    ).not.toThrow()
  })
})

describe('rendering', function () {
  const to =
    (1000 * 60 * 60 * 24 * 200) +
    (1000 * 60 * 60 * 6) +
    (1000 * 60 * 35) +
    (1000 * 54)

  it('matches snapshot', function () {
    const component = shallow(<Counter from={0} to={1} />)
    const tree = shallowToJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders a CounterSegment for each segment', function () {
    const component = shallow(<Counter from={0} to={1} />)
    expect(component.find(CounterSegment).length).toEqual(4)
  })

  it('passes digits correctly', function () {
    const component = shallow(<Counter from={0} to={to} />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['2', '0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['5', '4'])
  })

  test('minDigits', function () {
    var component = shallow(<Counter from={0} to={to} minDigits={1} />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['2', '0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['6'])
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['5', '4'])

    component = shallow(<Counter from={0} to={to} minDigits={3} />)
    counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['2', '0', '0'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['0', '3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['0', '5', '4'])
  })

  test('maxDigits', function () {
    var component = shallow(<Counter from={0} to={to} maxDigits={1} />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['9'])
    expect(counterSegments.at(1).props().digits).toEqual(['6'])
    expect(counterSegments.at(2).props().digits).toEqual(['9'])
    expect(counterSegments.at(3).props().digits).toEqual(['9'])

    component = shallow(<Counter from={0} to={to} maxDigits={2} />)
    counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digits).toEqual(['9', '9'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
    expect(counterSegments.at(3).props().digits).toEqual(['5', '4'])
  })

  test('minPeriod', function () {
    const component = shallow(<Counter from={0} to={to} minPeriod='minute' />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(3)
    expect(counterSegments.at(2).props().period).toBe('minutes')
    expect(counterSegments.at(2).props().digits).toEqual(['3', '5'])
  })

  test('maxPeriod', function () {
    var component = shallow(<Counter from={0} to={to} maxPeriod='hour' />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(3)
    expect(counterSegments.at(0).props().period).toBe('hours')
    expect(counterSegments.at(0).props().digits).toEqual(['4', '8', '0', '6'])

    var component = shallow(<Counter from={0} to={to} maxPeriod='minute' />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(2)
    expect(counterSegments.at(0).props().period).toBe('minutes')
    expect(counterSegments.at(0).props().digits).toEqual(['2', '8', '8', '3', '9', '5'])

    var component = shallow(<Counter from={0} to={to} maxPeriod='second' />)
    var counterSegments = component.find(CounterSegment)
    expect(counterSegments.length).toBe(1)
    expect(counterSegments.at(0).props().period).toBe('seconds')
    expect(counterSegments.at(0).props().digits).toEqual(['1', '7', '3', '0', '3', '7', '5', '4'])
  })

  test('radix', function () {
    var component = shallow(<Counter from={0} to={to} radix={12} />)
    var counterSegments = component.find(CounterSegment)

    expect(counterSegments.at(0).props().digits).toEqual(['1', '4', '8'])
    expect(counterSegments.at(1).props().digits).toEqual(['0', '6'])
    expect(counterSegments.at(2).props().digits).toEqual(['2', 'b'])
    expect(counterSegments.at(3).props().digits).toEqual(['4', '6'])
  })

  it('passes digitWrapper to segments', function () {
    const digitWrapper = (digit) => digit + '0'
    const component = shallow(<Counter from={0} to={to} digitWrapper={digitWrapper} />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digitWrapper).toEqual(digitWrapper)
    expect(counterSegments.at(1).props().digitWrapper).toEqual(digitWrapper)
    expect(counterSegments.at(2).props().digitWrapper).toEqual(digitWrapper)
    expect(counterSegments.at(3).props().digitWrapper).toEqual(digitWrapper)
  })

  it('passes digitMap to segments', function () {
    const digitMap = { '0': 'o' }
    const component = shallow(<Counter from={0} to={to} digitMap={digitMap} />)
    const counterSegments = component.find(CounterSegment)
    expect(counterSegments.at(0).props().digitMap).toEqual(digitMap)
    expect(counterSegments.at(1).props().digitMap).toEqual(digitMap)
    expect(counterSegments.at(2).props().digitMap).toEqual(digitMap)
    expect(counterSegments.at(3).props().digitMap).toEqual(digitMap)
  })
})

describe('state and props', function () {
  test('default state', function () {
    const from = (new Date()).getTime()
    const to = from +
      (1000 * 60 * 60 * 24 * 2) +
      (1000 * 60 * 60 * 6) +
      (1000 * 60 * 35) +
      (1000 * 54)
    const component = shallow(<Counter from={from} to={to} />)
    expect(component.state()).toMatchObject({
      timeDiff: to - from,
      numbers: {
        days: 2,
        hours: 6,
        minutes: 35,
        seconds: 54
      }
    })
  })

  test('default props', function () {
    const component = mount(<Counter from={0} to={1} />)
    expect(component.props()).toMatchObject({
      from: 0,
      to: 1,
      interval: 1000,
      minDigits: 2,
      minPeriod: 'second',
      maxPeriod: 'day'
    })
  })

  it('allows to set props', function () {
    const digitWrapper = (digit) => <div>{digit}</div>
    const component = mount(
      <Counter from={10} to={20} interval={897}
        minDigits={3} maxDigits={4}
        minPeriod='minute' maxPeriod='hour'
        syncTime radix={8}
        easingFunction='myEasingFn' easingDuration={123}
        digitMap={{ '0': 'o' }} digitWrapper={digitWrapper}
      />
    )
    expect(component.props()).toEqual({
      from: 10,
      to: 20,
      interval: 897,
      minDigits: 3,
      maxDigits: 4,
      minPeriod: 'minute',
      maxPeriod: 'hour',
      syncTime: true,
      easingFunction: 'myEasingFn',
      easingDuration: 123,
      radix: 8,
      digitMap: { '0': 'o' },
      digitWrapper: digitWrapper
    })
  })
})

describe('counting', function () {
  var component

  beforeEach(function () {
    jest.useFakeTimers()
    component = mount(<Counter from={0} to={10000} />)
    expect(component.state().numbers.seconds).toBe(10)
    expect(setInterval.mock.calls.length).toBe(1)
  })

  it('starts to count when mounted', function () {
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('works with "seconds" prop', function () {
    component = mount(<Counter seconds={10} />)
    expect(component.state().numbers.seconds).toBe(10)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(5000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('does not count when "frozen" is true', function () {
    component = mount(<Counter seconds={10} frozen />)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(10000)
    expect(component.state().numbers.seconds).toBe(10)
  })

  it('stops to count when stopped', function () {
    jest.runTimersToTime(5000)
    expect(component.state().numbers.seconds).toBe(5)

    component.instance().stop()

    jest.runTimersToTime(10000)
    expect(component.state().numbers.seconds).toBe(5)
  })

  it('stops to count when reached zero', function () {
    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(0)

    jest.runTimersToTime(10000)
    expect(component.state().timeDiff).toBe(0)
    expect(component.state().numbers.seconds).toBe(0)
  })

  it('syncs time when syncTime is set', function () {
    component = mount(<Counter from={0} to={10000} syncTime />)
    const newDate = component.state().currentTime + 7000
    jest.spyOn(Date.prototype, 'getTime').mockImplementation(() => newDate)
    jest.runTimersToTime(5000)
    expect(component.state().timeDiff).toBe(3000)
  })
})