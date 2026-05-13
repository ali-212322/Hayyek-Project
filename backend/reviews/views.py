from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from core.responses import success_response, created_response, error_response
from core.permissions import IsResident, IsProvider
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


class ReviewListView(APIView):
    """GET /api/v1/reviews/"""
    permission_classes = [AllowAny]

    def get(self, request):
        provider_id = request.query_params.get("provider")
        if provider_id:
            reviews = Review.objects.filter(provider_id=provider_id)
        else:
            reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return success_response(data=serializer.data)


class ReviewCreateView(APIView):
    """POST /api/v1/reviews/"""
    permission_classes = [IsAuthenticated, IsResident]

    def post(self, request):
        serializer = ReviewCreateSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return error_response("VALIDATION_ERROR", "Invalid data.", details=serializer.errors)

        review = serializer.save()
        return created_response(
            data=ReviewSerializer(review).data,
            message="Review submitted successfully.",
        )


class ReviewReplyView(APIView):
    """PUT /api/v1/reviews/<id>/reply/ — Provider only"""
    permission_classes = [IsAuthenticated, IsProvider]

    def put(self, request, pk):
        try:
            review = Review.objects.get(pk=pk, provider__user=request.user)
        except Review.DoesNotExist:
            return error_response("NOT_FOUND", "Review not found.", status_code=status.HTTP_404_NOT_FOUND)

        reply = request.data.get("provider_reply", "")
        review.provider_reply = reply
        review.save(update_fields=["provider_reply"])
        return success_response(message="Reply added successfully.")