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
```

## Verify that both behavior boards are synchronizer

- Using the `DigitalInputState` register, parse the value of of the button/switch and verify if both boards are synchronized (i.e. report the same timestamp for the same button press).