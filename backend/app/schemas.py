from pydantic import BaseModel


class SensorDataInput(BaseModel):
    Air_temperature_K: float
    Process_temperature_K: float
    Rotational_speed_rpm: float
    Torque_Nm: float
    Tool_wear_min: float

    def to_model_input(self):
        return {
            "Air temperature [K]": self.Air_temperature_K,
            "Process temperature [K]": self.Process_temperature_K,
            "Rotational speed [rpm]": self.Rotational_speed_rpm,
            "Torque [Nm]": self.Torque_Nm,
            "Tool wear [min]": self.Tool_wear_min,
        }