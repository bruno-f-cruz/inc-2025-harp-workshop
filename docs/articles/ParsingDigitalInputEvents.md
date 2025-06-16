# Parsing a DigitalInput `Event`s


Assemble the following example:
![image](~/images/behavior_digital_input.png)


While the `AnalogData` is a register that sends periodic message (~1kHz), other messages are triggered by non-period events. One example is data from the digital input lines. In the Harp Behavior board, register `DigitalInputState` emits an event when any of the digital input lines change state. It is important to note that similar to other devices (e.g. Open-Ephys acquisition boards), the state of all lines is multiplexed into a single integer (`U8`), where each bit represents the state (1/0) of each line. As a result, depending on the exact transformation you want to apply to the data, you may need to use the `Bitwise` operators to extract the state of each individual line:

- Subscribe to the `BehaviorEvents` stream.
- Add a `Parse(Harp.Behavior)` operator
- Set `Register` to `DigitalInputStatePayload` (You can also use `TimestampedDigitalInputState` if you need the timestamp)

- To extract the state of a specific line, use the `HasFlag` operator and set `Value` to the line you want to extract (e.g. `DI3`).
- Because the state of `DigitalInputState` changes when ANY of the lines change, we tend to use the `DistinctUntilChanged` to only propagate the message if the state of the line of interest changes.
- Finally, to trigger a certain behavior on a specific edge, we add a `Condition` operator to only allow `True` values to pass through. The behavior can easily be inverted by adding a `BitWiseNot` operator before, or inside, the condition operator.

:::workflow
![ParseDigitalInputState](~/workflows/ParseDigitalInputState.bonsai)
:::

