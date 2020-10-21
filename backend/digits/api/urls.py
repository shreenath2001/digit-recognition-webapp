from rest_framework.routers import DefaultRouter
from .views import DigitViewSet

router = DefaultRouter()

router.register(r'digits', DigitViewSet)

urlpatterns = router.urls
