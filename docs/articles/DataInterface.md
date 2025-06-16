# Data Interface

## Setting up the python environment

To analyze the data, you will need to install [harp-python package](https://harp-tech.org/articles/python.html).

```cmd
python -m venv .venv
.venv\Scripts\activate
pip install harp-python
```

```python
device = harp.create_reader("./data/MyDevice.harp")
data = device.DigitalInputState.read()
data_analog = device.AnalogData.read()

plt.figure()
plt.plot(data)
plt.plot(data_analog)
plt.xlabel("Harp time (s)")
plt.show()
```
