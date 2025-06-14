# Sending `Command`s to the device

Assemble the following example:
![image](~/images/behavior_led.png)

## Change the state of the digital output line

The Harp Behavior device has a set of four registers that can be used to control the state of the digital output lines: `OutputSet`, `OutputClear`, `OutputToggle` and `OutputState`. For simplicity, we will only use the `OutputSet` and `OutputClear` registers in this example. These registers are used to set or clear the state of a specific line, respectively. Similarly to the `DigitalInputState`, the value of this register also multiplexes the value of all the lines. First, we will set the state of line `DO3` to `High`:

- Add a `KeyDown(Windows.Input)` operator and set the `Filter` property to a specific key (e.g. `1`).
- Add a `CreateMessage(Harp.Behavior)` operator in after the `KeyDown` operator.
- Select `OutputSetPayload` under `Payload`. Make sure the `MessageType` is set to `Write` since we will now be asking the device to change the value of one of its registers.
- In the property `OutputSet`, select the line you want to turn on (e.g. `DO3`).
- Replicate the previous steps to clear (turn off) the state of the line `DO3` by using the `OutputClearPayload` instead, and the `KeyDown` operator with a different key (e.g. `2`).
- Verify that you can turn On and Off the line `DO3` by pressing the keys `1` and `2`, respectively.

:::workflow
![DigitalOutput](~/workflows/DigitalOutput.bonsai)
:::


## Changing the pulse mode of a digital output line

In most Harp devices you will find registers dedicated for configuration rather than "direct control". One example is the `OutputPulseEnable` register in the Harp Behavior board. This register is used when the user wants to pulse the line for a specific, pre-programmed, duration (e.g. opening a solenoid valve for exactly 10ms). To use this feature:

- Subscribe to the `BehaviorEvents` stream.
- Add a `Take` operator.
- Add `CreateMessage(Harp.Behavior)` operator in after the `Take` operator.
- Select `OutputPulseEnablePayload` under `Payload`. Make sure the `MessageType` is set to `Write`.
- Select the line you want to pulse (e.g. `DO3`), and add a `MulticastSubject` operator to send the message to the device.
- Add another `CreateMessage(Harp.Behavior)` operator after the `MulticastSubject` operator.
- Select `Pulse<Pin>Payload`, and set the value to the number of milliseconds you want this line to be high for on each pulse.
- Add a `MulticastSubject` operator to send the message to the device.
- Verify you see a pulse on the line `DO3` every time you press the key `1`.

:::workflow
![OutputPulseEnable](~/workflows/OutputPulseEnable.bonsai)
:::

> [!NOTE]
> The `BehaviorEvents`->`Take(1)` pattern will wait for the first message from the device before sending any commands, guaranteeing that the device is ready to receive commands.

## Getting the timestamp of a Write message

While we know that the state of the line `DO3` is changing, we do not have access to WHEN this change is occurring. Remember that for each `Write` message issued by the computer as a command, a `Write` message reply should be sent back from the device. To grab the timestamp of the reply message:

- Subscribe to the `BehaviorEvents` stream.
- Add a `Parse(Harp.Behavior)` operator and set the `Register` to `TimestampedOutputSet`.
- Expose the `Value` and `Seconds` members of the output structure.
- Add a `HasValue(DO3)` after `Value` to extract the state of the line `DO3`.
- Add a `Condition` operator to only allow `True` values to be propagated.
- Recover the initial timestamp of the message by using a `WithLatestFrom` operator connecting the output of `Condition` and `Seconds`.

:::workflow
![ParseDigitalOutputTimestamped](~/workflows/ParseDigitalOutputTimestamped.bonsai)
:::

> [!NOTE]
> More documentation on how to manipulate timestamped messages can be found [here](https://harp-tech.org/articles/message-manipulation.html)

## Closing the loop with PWM

Building on top of the Analog Data section, this example will walk you through how to achieve "close-loop" control between the duty-cycle of a closed-loop signal and the value of an ADC channel. This example also highlights one of the major advantages of having a computer in the loop: the ability to easily change the behavior of the system by changing the software.

- Configure `DO3` to be a PWM output by replicating the previous sections but instead of using the `Pulse<Pin>Payload`, configure the initial frequency (e.g. 500Hz) and duty cycle (e.g. 50%) of the PWM by using `PwmFrequency<Pin>Payload` and `PwmDutyCycle<Pin>Payload`.
- Add a `KeyDown(Windows.Input)` operator and set the `Filter` property to a specific key (e.g. `Up`).
- Add a `CreateMessage(Harp.Behavior)` operator in after the `KeyDown` operator, and set it to `PwmStart` and match the value to the pin you are using (e.g. `DO3`).
- Repeat the previous steps but now set the `PwmStop` register to stop the PWM signal when the key `Down` is pressed.
- Verify that you can start and stop the PWM signal.

- Resume the pattern in from the Analog Data section. and publish the value of the ADC channel 0 via a `PublishSubject` named `Photodiode`.
- Add a `Slice` operator to down-sample the signal to a more manageable update frequency (e.g. 100Hz) by setting the `Step` property to `10`. This is advised since the Behavior board is only spec'ed to run commands at 1kHz. Different hardware / functionality may require different sampling rates, so be sure to run tests before deploying the system.
- Subscribe to the `Photodiode` stream and add a `Rescale` operator. According to the [documentation of the Harp Behavior board](https://harp-tech.org/api/Harp.Behavior.html#registers), the duty cycle register only accepts values between 1 and 99. As a result, we need to rescale the value of the ADC channel to match this range. Set the `Max` and `Min` properties to the maximum and minimum values of the Photodiode signal. Set `RangeMax` and `RangeMin` to 99 and 1, respectively. Finally, to ensure values are "clipped" to the range, set `RescaleType` to `Clamp`.
- Finally, add a `Format(Harp.Behavior)` operator after the `Rescale` node. `Format`, similarly to `CreateMessage` is a Harp message constructor. It differs from `CreateMessage` in that it uses the incoming sequence (in this case the rescaled value of the ADC channel) to populate the message, instead of setting it as a property.
- Add a `MulticastSubject` operator to send the message to the device.

:::workflow
![AdcToPwm](~/workflows/AdcToPwm.bonsai)
:::

## Resetting the device

In some cases, you may want to reset the device to its initial known state. The Harp protocol defines a core register that can be used to achieve this behavior:

- Add a `KeyDown(Windows.Input)` operator and set the `Filter` property to a specific key (e.g. `R`).
- Add a `CreateMessage(Bonsai.Harp)` operator in after the `KeyDown` operator.
- Select `ResetDevicePayload` in `Payload`, and `RestoreDefault` as the value of the payload.
- Add a `MulticastSubject` operator to send the message to the device.
- Run Bonsai. The board's led should briefly flash to indicate that the reset was successful.

:::workflow
![ResetDevice](~/workflows/ResetDevice.bonsai)
:::
