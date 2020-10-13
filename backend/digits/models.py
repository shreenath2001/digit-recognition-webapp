from django.db import models
from django.conf import settings
from PIL import Image
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import cv2, os
import numpy as np
from tensorflow.keras.models import load_model

# Create your models here.
class Digit(models.Model):
    image = models.ImageField(upload_to = 'images') 
    result = models.CharField(max_length = 1, blank = True)
    updated = models.DateTimeField(auto_now = True)
    created = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        img = Image.open(self.image)
        img_array = img_to_array(img)

        new_img = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
        dim = (28, 28)
        resized_img = cv2.resize(new_img, dim, interpolation=cv2.INTER_AREA) #(28, 28)

        final_img = np.expand_dims(resized_img, axis = -1) #(28, 28, 1)
        final_img = np.expand_dims(final_img, axis = 0) #(1,28, 28, 1) beoz model was tested on (x, 28, 28, 1)

        try:
            file_model = os.path.join(settings.BASE_DIR, 'model/model.h5')
            graph = tf.compat.v1.get_default_graph()

            with graph.as_default():
                model = load_model(file_model)
                pred = np.argmax(model.predict(final_img))
                self.result = str(pred)

        except:
            self.result = 'Failed to classify'
        return super().save(*args, **kwargs)

