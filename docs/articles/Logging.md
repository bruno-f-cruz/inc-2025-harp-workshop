# Logging

## Logging messages from device

- Subscribe to `BehaviorEvents`
- Add a `Device.DataWriter(Harp.Behavior)` operator
- Set the `Path` property to the folder where you want to save the data (e.g. `./data/MyDevice.harp`)

:::workflow
![Logging](~/workflows/Logging.bonsai)
:::

## Ask for a device register read-dump

It is critical that the messages logged from the device are sufficient to reconstruct its state history. For that to be true, we need to know the initial state of all registers. This can be asked via a special register in the protocol core: [`OperationControl`](https://harp-tech.org/protocol/Device.html#r_operation_ctrl-u16--operation-mode-configuration). This register has a single bit that, when set, will trigger the device to send a dump all the values of all its registers.

- To the previous example, in a different branch:
- Add a `Timer` operator with its `DueTime` property set to 2 seconds. This will mimic the delayed start of an experiment.
- Add a `CreateMessage(Bonsai.Harp)` operator after the `Timer`
- Select `OperationControlPayload` under `Payload`. Depending on your use case, you might want to change some of the settings, but we recommend:
  - `DumpRegisters` set to `True` (Required for the dump)
  - `Heartbeat` set to `True` (Useful to know the device is still alive)
  - `MuteReplies` set to `False`
  - `OperationLed` set to `True`
  - `OperationMode` set to `Active`
  - `VisualIndicator` set to `On`
- Add a `Multicast` operator to send the message to the device

:::workflow
![LoggingWithDump](~/workflows/LoggingWithDump.bonsai)
:::

> [!IMPORTANT]
> In your experiments, always validate that your logging routine has fully initialized before requesting a reading dump from the device. Failure to do so may result in missing data.
