# Logging

## Logging messages from device

- Subscribe to `BehaviorEvents`
- Add a `Device.DataWriter(Harp.Behavior)` operator
- Set the `Path` property to the folder where you want to save the data (e.g. `./data/MyDevice.harp`)

:::workflow
![Logging](~/workflows/Logging.bonsai)
:::
