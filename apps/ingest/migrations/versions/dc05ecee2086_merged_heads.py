"""Merged Heads

Revision ID: dc05ecee2086
Revises: 3d1366e03a4c, d44ffcd1543a
Create Date: 2025-02-23 17:43:41.570328

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc05ecee2086'
down_revision: Union[str, None] = ('3d1366e03a4c', 'd44ffcd1543a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
