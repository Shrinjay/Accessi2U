"""Merge Heads

Revision ID: 7bd3262153a0
Revises: 3d1366e03a4c, d44ffcd1543a
Create Date: 2025-02-23 15:42:02.818924

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7bd3262153a0'
down_revision: Union[str, None] = ('3d1366e03a4c', 'd44ffcd1543a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
