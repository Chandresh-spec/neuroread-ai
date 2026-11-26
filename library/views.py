import mimetypes
import os

from django.http import FileResponse, Http404
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserFile, UserReadingData
from .serializers import (
    UserFileSerializer,
    UserFileUploadSerializer,
    UserReadingDataSerializer,
)


class UserFileListCreateView(APIView):
    """
    GET  /api/library/files/   — list current user's files
    POST /api/library/files/   — upload a new file (multipart/form-data)
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        files = UserFile.objects.filter(user=request.user)
        serializer = UserFileSerializer(files, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserFileUploadSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            user_file = serializer.save()
            return Response(
                UserFileSerializer(user_file, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserFileDetailView(APIView):
    """
    DELETE /api/library/files/<pk>/ — delete file + physical file from disk
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return UserFile.objects.get(pk=pk, user=user)
        except UserFile.DoesNotExist:
            raise Http404

    def delete(self, request, pk):
        user_file = self.get_object(pk, request.user)
        title = user_file.title
        user_file.delete()  # model.delete() also removes the disk file
        return Response(
            {"message": f'"{title}" deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT,
        )


class UserFileServeView(APIView):
    """
    GET /api/library/files/<pk>/serve/
    Streams the actual file bytes to the authenticated user.
    The browser / pdf.js fetches this with the JWT Authorization header.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user_file = UserFile.objects.get(pk=pk, user=request.user)
        except UserFile.DoesNotExist:
            raise Http404

        if not user_file.file:
            return Response(
                {"error": "File not found on server."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            if not user_file.file.storage.exists(user_file.file.name):
                return Response(
                    {"error": "File not found on server."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except NotImplementedError:
            pass
        except Exception:
            pass

        mime_type, _ = mimetypes.guess_type(user_file.file.name)
        mime_type = mime_type or "application/octet-stream"

        try:
            file_obj = user_file.file.open("rb")
            response = FileResponse(
                file_obj,
                content_type=mime_type,
            )
        except Exception as e:
            return Response(
                {"error": f"Could not read file: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        response["Content-Disposition"] = (
            f'inline; filename="{os.path.basename(user_file.file.name)}"'
        )
        # Allow pdf.js (running on file://) to read the response
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        return response


class UserReadingDataView(APIView):
    """
    GET  /api/library/files/<pk>/data/  — get reading data for a file
    PATCH /api/library/files/<pk>/data/ — update progress, highlights, notes, etc.
    Creates the record automatically if it doesn't exist yet.
    """

    permission_classes = [IsAuthenticated]

    def _get_file(self, pk, user):
        try:
            return UserFile.objects.get(pk=pk, user=user)
        except UserFile.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        user_file = self._get_file(pk, request.user)
        rd, _ = UserReadingData.objects.get_or_create(
            user=request.user, file=user_file
        )
        return Response(UserReadingDataSerializer(rd).data)

    def patch(self, request, pk):
        user_file = self._get_file(pk, request.user)
        rd, _ = UserReadingData.objects.get_or_create(
            user=request.user, file=user_file
        )
        serializer = UserReadingDataSerializer(rd, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
