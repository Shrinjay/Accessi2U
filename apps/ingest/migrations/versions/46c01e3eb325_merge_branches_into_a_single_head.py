"""Merge branches into a single head

Revision ID: 46c01e3eb325
Revises: 7bd3262153a0, dc05ecee2086
Create Date: 2025-02-27 22:02:49.736232

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '46c01e3eb325'
down_revision: Union[str, None] = ('7bd3262153a0', 'dc05ecee2086')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
